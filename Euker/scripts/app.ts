/* theses are notes for how to build yuker program. 

Create global variable to hold # of games won by each team = 0
Create global variable to hold # of hands won by each team = 0, reset after each game
Create global variable to hold # of tricks won by each team = 0, reset after each hand
Creat global variable trump 0=no trump, 1, 2, 3, 4. 
Create global variables for who called trump, 
Make enums for suits and ranks.


Build card class, with properties suit(1-4) and rank(1-6).   
Build a deck(array) of 24 cards
'Shuffle' the deck


Create player class, that can hold 1 to 5 cards, current position(dealer, left of dealer, etc) and the player's Name
make array that holds 4 players 
deal the deck, 5 cards to 4 players, and 1 card at dealers side


10. Ask each player if they want the dealer to pick it up. 
	10a. If yes, set the suit to trump, record which player picked it, and ask the dealer which card he/she would like to lose, ask player if he/she would like to take it alone and record result, and skip to ***11. 
	10b. If no, ask the first 3 players if they want to choose suit 1, 2, 3, 4,(not suit turned down) or pass. 
		10b1. If yes, set suit = trump, record which player picked it, ask player if he/she would like to take it alone and record result, and skip to ***11. 
		10b2. If no, ask dealer if he/she wants suit 1, 2, 3, 4,(not suit turned down) or no trump, set this = trump, record that dealer picked it, ask player if he/she would like to take it alone and record result. 
11. If not noTrump, Modify jack of opposite suit to trump to be trump and second highest card, modify jack of trump to be highest card



if taking alone(do this first, possibly making 'not taking it alone' code redundant), do below 5 times
delete player opposite whoever took it alone
	left of dealer goes
	next player goes, check legal card
	next player goes, check legal card
	if 4th player, next player goes. if not, continue
	determine which player won that trick. Iterate that teams trick by 1, and that player goes first.
	if taking it alone, if team that didnt take it alone, won that trick, the hand ends and they get 2 pts. reset tricks to 0. 
	else if 5 tricks done, team that took it alone gets 4 pts. reset tricks to 0. 
	else, repeat previous several steps
   


if not taking alone, do below 5 times
12. Each player plays 1 card, starting with left of dealer
	12. Ask left of dealer which card he/she wants to play
	13. Show everyone which card left of dealer played
	14. Ask opposite dealer which card he/she wants to play
		14a. check card is legal move (move follow suit)
	15. Ask right of dealer which card he/she wants to play
		15a. check card is legal move (move follow suit)
	16. Ask dealer which card he/she wants to play
		16a. check card is legal move (move follow suit)
	17. Determine which player won that trick
		17a. If any cards are trump, which is highest? Iterate that team's tricks by 1, and that player goes first.
		17b. If no cards are trump, which follow suit of first player, which is highest? Iterate that team's tricks by 1, and that player goes first. 
	18. if this was the 4th set of cards played, check if 1 team has 3 tricks
		if yes, give that team 1 point and move to next hand
		if no, continue. 
	19. if this was the 5th set of cards played, gives points accordingly; 
			if team that called got 3 or 4 tricks-->1pt, 5 tricks-->2pts, <3 tricks give other team 2pt
				if 1 team has >=10 pts, they win, iterate # of games won, Reset pts to 0, reset tricks to 0. 
				else if, reset tricks = 0, and break to next hand. 
	20. Each player plays 1 card, starting with who won last time, Repeat 12-17




*/

// make global variables that need to be kept track of between function, so i dont have to keep passing them in.

// enums, class and array for concepts suit, rank, card, deck
enum Suit {
	hearts = 1,
	diamonds = 2,
	clubs = 3,
	spades = 4,
}
enum Rank {
	nine = 9,
	ten = 10,

	//face cards
	jack = 11,
	queen = 12,
	king = 13,
	ace = 14,
}
// interface = class, for making your own type
interface Card {
	suit: Suit;
	rank: Rank;
}

// enum, class, and array for concepts playerPosition, player, all players
enum playerPosition {
	dealer = 0,
	leftofD = 1,
	oppositeD = 2,
	rightOfD = 3,
}

interface player {
	playerName: string;
	playerPosition: playerPosition;
	playerHand: Card[];
}


interface MatchState {
	game: GameState;
	trump: Suit;
	dealer: number;
	caller: number;
	team1Tricks: number;
	team2Tricks: number;
	lastTrickWinner: number;
	hands: Card[];
	trumpCandidate: Card;
	outThisRound: number;
}


interface GameState {
	team1Points: number;
	team2Points: number;
	lastDealer: number;
}


// create sorted deck of 24 cards
const deck: Card[] = [];
const DECKSIZE = 24;
for (let i = Suit.hearts; i <= Suit.spades; i++) {
	for (let j = Rank.nine; j <= Rank.ace; j++) {
		let card: Card = { suit: i, rank: j };
		deck.push(card);
	}
}

// randomize deck, by swapping nth card with a random card between nth and last position
function shuffle(arr: any[]) {
	for (let i = 1; i < arr.length; i++) {
		let swapElementPosition = Math.floor(Math.random() * (i + 1));  // Math.random() gets x >= 0 && x < 1
		let swappedElement = arr[swapElementPosition];
		arr[swapElementPosition] = arr[i];
		arr[i] = swappedElement;
	}
}

let bob: player;
bob.playerPosition = 0;
bob.playerPosition = playerPosition.dealer;

let players: player[] = addPlayers(); // team1 has positions 0, 2. team2 has positions 1,3. Adds players names. 
function addPlayers() {
	let players: player[] = [];
	for (let i = 0; i < 4; i++) {
		let name: string;
		if (i == 0 || i == 2) {
			name = prompt("Team 1: What are your names?\n", "seth")
		}
		else {
			name = prompt("Team 2: What are your names?\n", "benji")
		}
		let person: player = { playerName: name, playerPosition: null, playerHand: null };
		players.push(person);
	}
	// team1 players[0] && [2], team2 players[1] && [3]
	let swapPlayer: player = players[1];
	players[1] = players[2];
	players[2] = swapPlayer;
	return players;
}
setPlayersPosition(players);
function setPlayersPosition(players: player[]) {
	for (let i = 0; i < 4; i++) {
		players[i].playerPosition = i;
	}
}

// deal the hand
let dealersCard = dealHand(players, deck);
function dealHand(players: player[], deck: Card[]) {
	for (let i = 0; i < 4; i++) {
		for (let j = 0; j < 5; j++) {
			players[i].playerHand[j] = deck[i * 5 + j];
		}
	}

	return deck[4 * 5];
}

// show players what cards they have, and what the dealer's card is.

//calling trump
function pickItUp(players: player[], dealersCard: Card) {
	for (let i = 1; i < 5; i++) {
		let x = i % 4;
		for (let j = 0; j < 4; j++) {
			if (players[j].playerPosition == x) {
				let pickItUp = prompt("Would you like the dealer to pick up " + rankString(dealersCard) + " of " + suitString(dealersCard) + "?\n", "yes/no");
				if (pickItUp == "yes") {
					let yes = prompt("Would you like to take it alone?\n", "yes/no");
					if (yes == "yes") {
						takeItAlone = 1;  // set takeItAlone
					}
					trump = dealersCard.suit;  // set trump
					whoCalledTrump = j;  // set whoCalledTrump
					for (let k = 0; k < 4; k++) {  // have dealer actually pick up the card
						if (players[k].playerPosition == playerPosition.dealer) {
							let discard = +prompt("Which card would you like to discard?\n", "1, 2, 3, 4, 5");
							players[k].playerHand[<any>discard - 1] = dealersCard;
						}
					}
					j = 4;
					i = 5; // effectively exit both for loops
				}
			}
		}
	}
	if (trump == -1) {
		callTrump(players, dealersCard);
	}
}
function callTrump(players: player[], dealersCard: Card) {
	for (let i = 1; i < 5; i++) {
		let x = i % 4;
		for (let j = 0; j < 4; j++) {
			if (players[j].playerPosition == x) {
				if (players[j].playerPosition != 0) {
					let callIt = prompt("Would you like to call trump? It may not be " + suitString(dealersCard) + ".\n", "no, hearts, diamons, clubs, spades");
					if (callIt != "no") {
						let yes = prompt("Would you like to take it alone?\n", "yes/no");
						if (yes == "yes") {
							takeItAlone = 1;  // set takeItAlone
						}
						if (callIt == "hearts") {
							trump = Suit.hearts;  // set trump
							whoCalledTrump = j;  // set whoCalledTrump
						}
						else if (callIt == "diamons") {
							trump = Suit.diamonds;  // set trump
							whoCalledTrump = j;  // set whoCalledTrump
						}
						else if (callIt == "clubs") {
							trump = Suit.clubs;  // set trump
							whoCalledTrump = j;  // set whoCalledTrump
						}
						else if (callIt == "spades") {
							trump = Suit.spades;  // set trump
							whoCalledTrump = j;  // set whoCalledTrump
						}
						else {
							alert("something went wrong in callTrump function\n");
						}

					}
					j = 4;
					i = 5;  // to exit these loops
				}
				else if (players[j].playerPosition == playerPosition.dealer) {
					let callIt = prompt("What would you like to call trump? It may not be " + suitString(dealersCard) + ".\n", "hearts, diamons, clubs, spades, no trump");
					let yes = prompt("Would you like to take it alone?\n", "yes/no");
					if (yes == "yes") {
						takeItAlone = 1;  // set takeItAlone
					}
					if (callIt == "hearts") {
						trump = Suit.hearts;  // set trump
						whoCalledTrump = j;  // set whoCalledTrump
					}
					else if (callIt == "diamons") {
						trump = Suit.diamonds;  // set trump
						whoCalledTrump = j;  // set whoCalledTrump
					}
					else if (callIt == "clubs") {
						trump = Suit.clubs;  // set trump
						whoCalledTrump = j;  // set whoCalledTrump
					}
					else if (callIt == "spades") {
						trump = Suit.spades;  // set trump
						whoCalledTrump = j;  // set whoCalledTrump
					}
					else if (callIt == "no trump") {
						trump = Suit.noTrump;  // set trump
						whoCalledTrump = j;  // set whoCalledTrump
					}
					else {
						alert("something went wrong in callTrump function\n");
					}
				}
				j = 4;
				i = 5;
			}
		}
	}

}

// playing 1 trick
function playTrick(plyers: player[]) {
	let firstcardPlayed: Card = null;  // for following suit
	let highestCard: Card = null;  // keeping track of the winning card
	let playerWithHighestCard = -1; // keeping track of whose winning the trick
	for (let i = whoStartsTrick; i < 5; i++) {
		let x = i % 4;
		for (let j = 0; j < 4; j++) {
			if (players[j].playerPosition == x) {
				if (takeItAlone = 1) {
					if (whoCalledTrump == j || whoCalledTrump % 2 != j % 2) {
						let cardPlayed = +prompt("Which card would you like to play?\n", "1, 2, 3, 4, 5");
						let newCard: Card = players[j].playerHand[cardPlayed - 1];
						if (newCardHigher(newCard, highestCard)) {
							highestCard = newCard;
							playerWithHighestCard = j;
							whoStartsTrick = players[j].playerPosition;
						}
						players[j].playerHand[cardPlayed - 1] = null;
						j = 4; // move to next player
					}
				}
				else {
					let cardPlayed = +prompt("Which card would you like to play?\n", "1, 2, 3, 4, 5");
					let newCard: Card = players[j].playerHand[cardPlayed - 1];
					if (newCardHigher(newCard, highestCard)) {
						highestCard = newCard;
						playerWithHighestCard = j;
						whoStartsTrick = players[j].playerPosition;
					}
					players[j].playerHand[cardPlayed - 1] = null;
					j = 4;  // move to next player
				}
			}
		}
	}
	if (playerWithHighestCard % 2 == 0) {
		team1tricks++;
	}
	else {
		team2tricks++;
	}
}

function newCardHigher(newCard: Card, highestCard: Card) {
	if (highestCard == null) {
		return true;
	}
}


// increment player's position between hands, and reset trump, whoCalledTrump, takeItAlone, whoStarsTrick, team1/2tricks
function incrementPlayersPosition(players: player[]) {
	for (let i = 0; i < 4; i++) {
		if (players[i].playerPosition == 3) {
			players[i].playerPosition = 0;
		}
		else {
			players[i].playerPosition++;
		}
	}
	trump = -1;  // reset trump
	whoCalledTrump = -1;  // reset whoCalledTrump
	takeItAlone = -1;  // reset takeItAlone
	whoStartsTrick = 1;  // reset whoStartsTrick to be left of dealer
	team1tricks = 0;  // reset tricks for each team
	team2tricks = 0; // reset tricks for each team
}


function rankString(card: Card) {
	let rank: string = null;
	if (card.rank == 9) {
		rank = "nine";
	}
	else if (card.rank == 10) {
		rank = "ten";
	}
	else if (card.rank == 11) {
		rank = "jack";
	}
	else if (card.rank == 12) {
		rank = "queen";
	}
	else if (card.rank == 13) {
		rank = "king";
	}
	else if (card.rank == 14) {
		rank = "ace";
	}
	else {
		alert("error in rankString function\n");
	}
	return rank;
}

function suitString(card: Card) {
	let suit: string = null;
	if (card.suit == 1) {
		suit = "hearts";
	}
	else if (card.suit == 2) {
		suit = "diamons";
	}
	else if (card.suit == 3) {
		suit = "clubs";
	}
	else if (card.suit == 4) {
		suit = "spades";
	}
	else {
		alert("error in suitString function\n");
	}
	return suit;
}

