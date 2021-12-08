/* theses are notes for how to build yuker program. 

Create global variable for hold # of games won by each team = 0
1. Create global variable to hold # of hands won by each team = 0, reset after each game
    1a. Create global variable to hold # of tricks won by each team = 0, reset after each hand
2. Creat global variable trump 0=no trump, 1, 2, 3, 4. 
Create global variables for who called trump, 
3. Make enums for suits and ranks.
4. Build card object, with properties suit(1-4) and rank(1-6).   
5. Build a deck(array) of 24 cards
6. 'Shuffle' the deck
7. Create player object, that can hold 1 to 5 cards, current position(dealer, left of dealer, etc) and the player's Name
9. deal the deck, 5 cards to 4 players, and 1 card at dealers side
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


let team1gamesWon = 0;  // # of games won by each team
let team2gamesWon = 0;
let team1pts = 0;  // # of pts won by each team
let team2pts = 0;
let team1tricks = 0;  // # of tricks won by each team
let team2tricks = 0; 
let trump = -1;  //
let whoCalledTrump = -1; // 

enum suit {
    hearts = 0,
    diamonds = 1,
    clubs = 2,
    spades = 3,
    noTrump = 4,
}

trump = suit.hearts; 
console.log(trump);