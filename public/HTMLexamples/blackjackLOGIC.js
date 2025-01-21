const readline = require("readline");

class Blackjack {
    constructor() {
        this.deck = new Deck();
        this.players = []

        this.dealer = new Player("Dealer");
        this.players.push(this.dealer);
    }

    getPlayers(){
        return this.players
    }

    setPlayers(playerArr){
        this.players = [];
        playerArr.forEach(e => {
            this.addPlayer(e)
        });
        return this.players
    }

    addPlayer(name){
        let player = new Player(name);
        this.players.push(player)
        return player
    }

    startGame() {
        this.deck.shuffle();

        this.players.forEach(e => {
            e.addCard(this.deck.dealCard());
            e.addCard(this.deck.dealCard());
            console.log(`${e.name}'s Hand: ${e.showHand()} (Total: ${e.calculateHand()})`);
        });
        this.dealer.addCard(this.deck.dealCard());
        this.dealer.addCard(this.deck.dealCard());

        console.log(`Dealer's Hand: ${this.dealer.showHand(true)}`);

        // this.players.forEach((e) => {this.playerTurn(e);})
        // while(this.dealer.calculateHand() <= 17){
        //     this.hit(this.dealer);
        //     if(this.dealer.calculateHand() >= 17){break}
        // }
        // this.determineWinner();

        (async () => {
            for (const player of this.players) {await this.playerTurn(player);}
                while (this.dealer.calculateHand() < 17) {
                this.hit(this.dealer);
                if (this.dealer.calculateHand() >= 17) {break;}
            }
            this.determineWinner();
        })();
    }

    async playerTurn(player){
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        const askAction = () => {
            return new Promise((resolve) => {
                rl.question(`${player.name} (Current hand: ${player.calculateHand()}), do you want to 'hit' or 'stand'?(H/S) `, (answer) => {
                    if (["h", "hit", "ht", "yes", "y"].includes(answer.toLowerCase())) {
                        this.hit(player);

                        if (player.calculateHand() > 21) {
                            console.log(`${player.name}, you busted!`);
                            rl.close();
                            resolve();
                        } else {
                            resolve(askAction());
                        }
                    } else if (["s", "stand", "stay", "st", "no", "n"].includes(answer.toLowerCase())) {
                        console.log(`${player.name} chose to stand.`);
                        rl.close();
                        resolve();
                    } else {
                        console.log("Invalid input. Please type 'hit' or 'stand'.");
                        resolve(askAction());
                    }
                });
            });
        };

        await askAction();
    }

    hit(player) {
        const card = this.deck.dealCard();
        player.addCard(card);
        console.log(`${player.name} hits and draws ${card.toString()}`);
        console.log(`${player.name}'s new hand: ${player.showHand()} (Total: ${player.calculateHand()})`);
        return card
    }

    determineWinner() {
        this.players.forEach(player => {
            if (player.name === "Dealer") return;
    
            const playerTotal = player.calculateHand();
            const dealerTotal = this.dealer.calculateHand();
    
            console.log(`${player.name}'s Total: ${playerTotal}`);
            console.log(`Dealer's Total: ${dealerTotal}`);
    
            if (playerTotal > 21) {
                console.log(`${player.name} busts! Dealer wins!`);
            } else if (dealerTotal > 21 || playerTotal > dealerTotal) {
                console.log(`${player.name} wins!`);
            } else if (playerTotal < dealerTotal) {
                console.log("Dealer wins!");
            } else {
                console.log("It's a tie!");
            }
        });
    }    
}

class Deck {
    constructor() {
        this.cards = [];

        const suits = ["hearts", "diamonds", "clubs", "spades"];
        const ranks = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
        
        for (let suit of suits) {
            for (let rank of ranks) {
                this.cards.push(new Card(rank, suit));
            }
        }
    }

    shuffle() {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }

    dealCard() {
        return this.cards.pop();
    }
}

class Card {
    constructor(rank, suit) {
        this.rank = rank;
        this.suit = suit;
    }

    getIcon(){
        const icons = {
            hearts: "♥",
            spades: "♠",
            diamonds: "♦",
            clubs: "♣"
        };
        const icon = icons[this.suit]        
        return icon
    }
    

    getValue() {
        if (["J", "Q", "K"].includes(this.rank)) {
            return 10;
        } else if (this.rank === "A") {
            return 11;
        } else {
            return parseInt(this.rank);
        }
    }

    toString() {        
        return `${this.rank} ${this.getIcon()}`;
    }
}

class Player {
    constructor(name) {
        this.name = name;
        this.hand = [];
        this.winTotal = 0;
    }

    addCard(card) {
        this.hand.push(card);
    }

    showHand(hidden = false) {
        if (hidden) {          
            return `${this.hand[0].toString()} and [Hidden]`;
        }
        return this.hand.map(card => card.toString()).join(", ");
    }

    calculateHand() {
        let total = 0;
        let aces = 0;        

        this.hand.forEach(card => {
            total += card.getValue();
            if (card.rank === "A") aces++;            
        });

        while (total > 21 && aces > 0) {
            total -= 10;
            aces--;
        }

        return total;
    }
}

const game = new Blackjack();
game.setPlayers(["Player1", "Player2"])

game.startGame();