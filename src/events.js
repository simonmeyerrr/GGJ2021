function endTurn(gameState) {
    if (gameState.hasPicked === true) {
        gameState.hasPicked = false;
        while (1) {
            gameState.playing = (gameState.playing + 1) % gameState.players.length;
            if (gameState.players[gameState.playing].ws) {
                break;
            }
        }
    }
}

function setRace(gameState, pos, race) {
    gameState.players[pos].race = race;
}

function raceSelectedAll(gameState) {
    for (let i = 0; i < gameState.players.length; i++) {
        if (gameState.players[i].race == null && gameState.players[i].ws) {
            return (false);
        }
    }
    return (true);
}

function eventCard() {

}

function pickCard(gameState, pos) {
    if (gameState.players[pos].faceUp)
        gameState.nextDeck.push(gameState.players[pos].faceUp);
    gameState.players[pos].faceUp = gameState.deck.shift();
    gameState.hasPicked = true;
    eventCard();
}

function callChtulu(gameState) {
    let RemainingPlayer = gameState.length;
    let total = 0;
    let card;

    for (let i = 0; i < gameState.players.length; i++) {
        if (!gameState.players[i].ws)
            RemainingPlayer--;
        else
            total += gameState.players[i].faceUp.value;
    }

    card = gameState.deck.shift();
    total += card.value;
    gameState.nextDeck.push(card);
    card = gameState.deck.shift();
    total += card.value;
    gameState.nextDeck.push(card);
    card = null;

    if (total >= (RemainingPlayer * 10))
        return (true);
    return (false);
}

module.exports = {
    endTurn,
    setRace,
    raceSelectedAll,
    pickCard,
    callChtulu
}