export enum Carta {
	Two,
	Three,
	Four,
	Five,
	Six,
	Seven,
	Eight,
	Nine,
	Ten,
	Jack,
	Queen,
	King,
	Ace,
	PLACEHOLDER
}

//export enum Value {
//  Two = 2,
//  Three = 3,
//  Four = 4,
//  Five = 5,
//  Six = 6,
//  Seven = 7,
//  Eight = 8,
//  Nine = 9,
//  Ten = 10,
//  Jack = 10,
//  Queen = 10,
//  King = 10,
//  Ace = 11
//}

export enum State {
	PLAYER_WON,
	NEUTRAL,
	PLAYER_LOST
}

export enum Color {
	SPADES,
	HEARTS,
	DIAMONDS,
	CLOVERS
}

class Card {
	symbol: Carta;
	color: Color;
	min: number;
	max: number;

	constructor(_symbol: Carta, _color: Color) {
		this.symbol = _symbol;
		this.color = _color;

		this.max = this.Value();
		if (_symbol == Carta.Ace) {
			this.min = 1;
		} else {
			this.min = this.max;
		}
	}

	ToString() {
		// safe the cards as a string?
		// {Color}{symbol/number};{Carta};{Carta}
		let result = '';
		result += colorToString(this.color);
		result += symbolToString(this.symbol);

		return result;
	}

	Value() {
		switch (this.symbol) {
			case Carta.Two:
				return 2;
			case Carta.Three:
				return 3;
			case Carta.Four:
				return 4;
			case Carta.Five:
				return 5;
			case Carta.Six:
				return 6;
			case Carta.Seven:
				return 7;
			case Carta.Eight:
				return 8;
			case Carta.Nine:
				return 9;
			case Carta.Ten:
				return 10;
			case Carta.Jack:
				return 10;
			case Carta.Queen:
				return 10;
			case Carta.King:
				return 10;
			case Carta.Ace:
				return 11;
		}
	}
}

//export type Card = {
//  symbol: Carta,
//  color: Color,
//  //value: Value
//}

export class Hand {
	cards: Card[];

	constructor(_cards: Card[]) {
		this.cards = _cards;
	}

	sumOfCards(): number {
		let min = 0;
		let current = 0;

		for (let i = 0; i < this.cards.length; i++) {
			if (this.cards[i].symbol === Carta.Ace) {
				current += 11;
				min += 1;
			} else {
				current += this.cards[i].max;
				min += this.cards[i].max;
			}
		}
		return adjustForAces(current, min);
	}
}

export function enOfGameState(playerCards: Hand, dealerCards: Hand): State {
	if (dealerCards.sumOfCards() > playerCards.sumOfCards()) return State.PLAYER_LOST;
	if (dealerCards.sumOfCards() == playerCards.sumOfCards()) return State.NEUTRAL;
	else return State.PLAYER_WON;
}

export enum Decision {
	STAND,
	HIT,
	DOUBLE,
	START,
	UNKOWN
}

export const translateDecitionUser = (decition: string): Decision => {
	// DECITIONS = ['hit', 'double', 'stand', 'start'];
	//
	switch (decition) {
		case 'hit':
			return Decision.HIT;
		case 'double':
			return Decision.DOUBLE;
		case 'stand':
			return Decision.STAND;
		case 'start':
			return Decision.START;

		default:
			return Decision.UNKOWN;
	}
};

export function createCards(): Card[] {
	let cards: Card[] = new Array();

	const suits: Color[] = [Color.SPADES, Color.HEARTS, Color.CLOVERS, Color.DIAMONDS];
	const symbols: Carta[] = [
		Carta.Two,
		Carta.Three,
		Carta.Four,
		Carta.Five,
		Carta.Six,
		Carta.Seven,
		Carta.Eight,
		Carta.Nine,
		Carta.Ten,
		Carta.Jack,
		Carta.Queen,
		Carta.King,
		Carta.Ace
	];

	for (let i = 0; i < suits.length; i++) {
		for (let x = 0; x < symbols.length; x++) {
			const suit = suits[i];
			const symbol = symbols[x];

			const card = new Card(symbol, suit);
			//let card: Card = { color: suits[i], symbol: symbols[i] };
			cards.push(card);
		}
	}

	return cards;
}

export function shuffle(cards: Card[]) {
	// for 1000 turns
	// switch the values of two random cards
	for (let i = 0; i < 1000; i++) {
		let location1 = Math.floor(Math.random() * cards.length);
		let location2 = Math.floor(Math.random() * cards.length);
		let tmp = cards[location1];

		cards[location1] = cards[location2];
		cards[location2] = tmp;
	}
}

function colorToString(input: Color): string {
	switch (input) {
		case Color.SPADES:
			return 'S';
		case Color.HEARTS:
			return 'H';
		case Color.DIAMONDS:
			return 'D';
		case Color.CLOVERS:
			return 'C';
	}
}

export function symbolToString(input: Carta): string {
	switch (input) {
		case Carta.Two:
			return '2';
		case Carta.Three:
			return '3';
		case Carta.Four:
			return '4';
		case Carta.Five:
			return '5';
		case Carta.Six:
			return '6';
		case Carta.Seven:
			return '7';
		case Carta.Eight:
			return '8';
		case Carta.Nine:
			return '9';
		case Carta.Ten:
			return 'T';
		case Carta.Jack:
			return 'J';
		case Carta.Queen:
			return 'Q';
		case Carta.King:
			return 'K';
		case Carta.Ace:
			return 'A';
	}
}

function stringToColor(input: string): Color {
	switch (input) {
		case 'S':
			return Color.SPADES;
		case 'H':
			return Color.HEARTS;
		case 'D':
			return Color.DIAMONDS;
		case 'C':
			return Color.CLOVERS;
		default:
			throw new Error('Invalid argument for color: {' + input + '}');
	}
}

function stringToSymbol(input: string): Carta {
	switch (input) {
		case '2':
			return Carta.Two;
		case '3':
			return Carta.Three;
		case '4':
			return Carta.Four;
		case '5':
			return Carta.Five;
		case '6':
			return Carta.Six;
		case '7':
			return Carta.Seven;
		case '8':
			return Carta.Eight;
		case '9':
			return Carta.Nine;
		case 'T':
			return Carta.Ten;
		case 'J':
			return Carta.Jack;
		case 'Q':
			return Carta.Queen;
		case 'K':
			return Carta.King;
		case 'A':
			return Carta.Ace;
		default:
			throw new Error('Invalid argument for symbol: {' + input + '}');
	}
}

export function CardToString(cards: Card) {
	return cards.ToString();
}

export function CardsToString(cards: Card[]) {
	let result = '';

	const theresNone = cards.length == 0;

	for (let i = 0; i < cards.length - 1; i++) {
		result += cards[i].ToString();
		result += ';';
	}

	if (!theresNone) {
		result += cards[cards.length - 1].ToString();
	}
	return result;
}

export function StringToCards(cards: string): Card[] {
	const result = Array();
	if (cards === '') return result;

	if (cards === '') return result;

	const cartas = cards.split(';');

	for (let i = 0; i < cartas.length; i++) {
		const color = stringToColor(cartas[i][0]);
		const symbol = stringToSymbol(cartas[i][1]);
		const card = new Card(symbol, color);
		result.push(card);
	}

	return result;
}

// decision to play dealer
export function adjustForAces(current_count: number, min_count: number) {
	while (current_count > 21 && current_count !== min_count) {
		current_count -= 10; // Convert an Ace from 11 to 1
	}
	return current_count; // Return the adjusted hand value
}
