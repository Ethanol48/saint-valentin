import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const user = sqliteTable('user', {
	id: text('id').primaryKey(),
	login: text('login').notNull().unique(),
	username: text('username').notNull(),
	passwordHash: text('passwordHash').notNull(),
	points: integer('points').default(10),
  	claimedOrders: integer('claimed_orders', { mode: 'boolean' }).default(false),
  	wantToClaim: integer('want_to_claim', { mode: 'boolean' }).default(false),
	isAdmin: integer('is_admin', { mode: 'boolean' }).notNull().default(false),
});

export const session = sqliteTable('session', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull()
});


export const games = sqliteTable('games', {
  userId: text('user_id').primaryKey().references(() => user.id),
	foundSecret: integer('foundSecret', { mode: 'boolean' }).notNull().default(false),
	button: integer('button', { mode: 'boolean' }).notNull().default(false),
	last_spin: integer('last_spin').notNull().default(0),
	numberofplaytoday: integer('numberofplaytoday').notNull().default(0),
	lastdayplayed_gobelet: text('lastdayplayed_gobelet').notNull().default('')
})

export const orders = sqliteTable('orders', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id),
  productId: text('product_id')
    .notNull()
    .references(() => items.id),

})

export const items = sqliteTable('stock', {
	id: text('id').primaryKey(),
	name: text('name').unique().notNull(),
	desc: text('desc').notNull(),
  price: integer('price').notNull(),
	stock: integer('stock').default(0),
});

export const blackjack = sqliteTable('blackjack', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),

	// safe the cards as a string?
	// {Color}{symbol/number};{Carta};{Carta}
	playerCards: text('player_cards').notNull().default(''),
	dealerCards: text('dealer_cards').notNull().default(''),
	pile_cards: text('pile_cards').notNull(),
	totalbet: integer('total_bet').notNull().default(0),
	stand: integer('stand', { mode: 'boolean' }).default(false),
	started: integer('started', { mode: 'boolean' }).default(false),
	firstPlay: integer('first_play', { mode: 'boolean' }).default(true),
	neutral: integer('neutral', { mode: 'boolean' }).default(false),
	ended: integer('ended', { mode: 'boolean' }).default(false),
	playerWon: integer('player_won', { mode: 'boolean' }).default(false),
	createdAt: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.default(
    sql`(strftime('%s', 'now'))`
  ),
});


export const enigme = sqliteTable('enigme', {
	id: text('id').primaryKey(),
	question: text('question').notNull(),
	reponse: text('reponse').notNull(),
	date_month: integer('date_month').notNull(),
	date_day: integer('date_day').notNull(),
	is_recuperer: integer('is_recuperer', { mode: 'boolean' }).default(false),
	points:integer('points').notNull().default(0),
	user_victory:text('user_victory').notNull().default('None'),
});




export type Session = typeof session.$inferSelect;
export type User = typeof user.$inferSelect;
export type Orders = typeof orders.$inferSelect;
export type Items = typeof items.$inferSelect;
export type Enigme = typeof enigme.$inferSelect;
export type Games = typeof games.$inferSelect;
