import { hash, verify } from '@node-rs/argon2';
import { encodeBase32LowerCase } from '@oslojs/encoding';
import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import * as auth from '$lib/server/auth';
import { db } from '$lib/server/db';
import { addPoints } from '$lib/server/db/utilities';
import * as table from '$lib/server/db/schema';
import type { Actions, PageServerLoad } from './$types';
import { LOGIN_REDIRECT } from '$lib/constants';

export const load: PageServerLoad = async (event) => {
	if (event.locals.user) {
		return redirect(302, '/home');
	}
	return {
		user: event.locals.user
	};
};

export const actions: Actions = {
	login: async (event) => {
		const formData = await event.request.formData();
		const login = formData.get('login');
		const password = formData.get('password');

		if (!validateUsername(login)) {
			return fail(400, {
				message: 'Invalid username (min 3, max 20 characters, alphanumeric only)'
			});
		}
		if (!validatePassword(password)) {
			return fail(400, { message: 'Invalid password (min 6, max 255 characters)' });
		}

		const results = await db.select().from(table.user).where(eq(table.user.login, login));

		const existingUser = results.at(0);
		if (!existingUser) {
			return fail(400, { message: 'Incorrect email or password' });
		}

		const validPassword = await verify(existingUser.passwordHash, password, {
			memoryCost: 19456,
			timeCost: 2,
			outputLen: 32,
			parallelism: 1
		});
		if (!validPassword) {
			return fail(400, { message: 'Incorrect email or password' });
		}

		const sessionToken = auth.generateSessionToken();
		const session = await auth.createSession(sessionToken, existingUser.id);
		auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);

		return redirect(302, '/home');
	},
	register: async (event) => {
		const formData = await event.request.formData();
		const login = formData.get('login');
		const username = formData.get('username');
		const password = formData.get('password');

		if (!validateUsername(login)) {
			console.log('invalid user: ', login);
			return fail(400, { message: 'Invalid email' });
		}
		if (!validatePassword(password)) {
			return fail(400, { message: 'Invalid password' });
		}

		let usernameStr: string;
		if (username === null) {
			return fail(400, { message: 'You must set an username' });
		} else {
			usernameStr = username.toString();
		}

		const results = await db.select().from(table.user).where(eq(table.user.login, login));

		const existingUser = results.at(0);
		if (existingUser) {
			return fail(400, { message: 'This email has already been used !' });
		}

		const userId = generateUserId();
		const passwordHash = await hash(password, {
			// recommended minimum parameters
			memoryCost: 19456,
			timeCost: 2,
			outputLen: 32,
			parallelism: 1
		});

		try {
			await db
				.insert(table.user)
				.values({ id: userId, login: login, username: usernameStr, passwordHash: passwordHash });

			const sessionToken = auth.generateSessionToken();
			const session = await auth.createSession(sessionToken, userId);
			await auth.createOrderUser(userId);
			auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
		} catch (e) {
			return fail(500, { message: 'An error has occurred' });
		}
		return redirect(302, '/home');
	},
	logout: async (event) => {
		if (!event.locals.session) {
			return fail(401);
		}
		await auth.invalidateSession(event.locals.session.id);
		auth.deleteSessionTokenCookie(event);

		return redirect(302, LOGIN_REDIRECT);
	}
};

function generateUserId() {
	// ID with 120 bits of entropy, or about the same as UUID v4.
	const bytes = crypto.getRandomValues(new Uint8Array(15));
	const id = encodeBase32LowerCase(bytes);
	return id;
}

const regex = /^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/;

function validateUsername(username: unknown): username is string {
	return (
		typeof username === 'string' &&
		username.length >= 3 &&
		username.length <= 60 &&
		regex.test(username)
	);
}

function validatePassword(password: unknown): password is string {
	return typeof password === 'string' && password.length >= 6 && password.length <= 255;
}
