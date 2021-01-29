/**
 * Return a new player with its race and no card.
 */

function createPlayer(race) {
    let player = {
        race,
        faceUp = null
    };
    return (player);
}

/**
 * Pick a new card, change nextdeck + call event
 */

function pickCard(deck, player, nextdeck) {
    if (player.faceUp)
        nextdeck.push(player.faceUp)
    player.faceUp = deck.shift();
    eventCard(player.faceUp);
}

/**
 * Reset decks
 */

function resetDeck(deck, nextdeck)
{
    deck = nextdeck
    nextdeck = [];
    return (deck)
}

module.exports = {
    createPlayer,
    pickCard,
    resetDeck
}