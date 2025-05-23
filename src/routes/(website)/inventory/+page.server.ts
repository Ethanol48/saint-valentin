import type { Actions, PageServerLoad } from './$types';
import { GetWantToClaim, GetOrdersOfUserWithDesc } from '$lib/server/db/utilities';
import { fail } from '@sveltejs/kit';
import { SetWantToClaim } from '$lib/server/db/utilities';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user === null) {
		return redirect(302, '/home');
	}

	const items = await GetOrdersOfUserWithDesc(locals.user.id);
	const date = new Date();
	const jour = date.getTime(); // TODO: choisir plus tard a partir de quel moment on peut reclamer
	return { user: locals.user, items: items, claimed: await GetWantToClaim(locals.user?.id) };
};

export const actions: Actions = {
	Claim: async ({ locals }) => {
		if (locals.user === null) return fail(401, { error: 'You need to be authenticated' });

		try {
			await SetWantToClaim(locals.user.username);
			return { success: true };
		} catch (e) {
			return fail(500, { error: 'an error ocurred' });
		}
	}
};
