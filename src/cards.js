/**
 *  Generate a 52 deck of cards, sorted by value.
 */

function createDeck() {
    let deck = [];
    for (let x = 1; x < 14; x++) {
        deck.push({color: "H", value: x});
        deck.push({color: "D", value: x});
        deck.push({color: "S", value: x});
        deck.push({color: "C", value: x});
    }
    return (deck);
}

/**
 *  Shuffle a deck of whatever its size is.
 */

function shuffle(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
}

module.exports = {
    createDeck,
    shuffle
}