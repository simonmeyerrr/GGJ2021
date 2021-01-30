const cardFct = require('./cards')

function deckIsEmpty(gameState) {
    if (gameState.deck.length == 0) {
        gameState.deck = cardFct.shuffle(gameState.nextDeck);
        gameState.nextDeck = [];
    }
}

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

function eventCard(gameState, pos) {
    if (gameState.players[pos].faceUp <= 3) {                                           // carte 1 - 3         
        if (gameState.players[pos].drinkCanceled) {
            gameState.players[pos].drinkCanceled = false;
            return;
        } else if (gameState.players[pos].doubleDrink) {
            gameState.players[pos].drank += (gameState.players[pos].faceUp * 2);
            gameState.players[pos].doubleDrink = false;
            return;
        }
        gameState.players[pos].drank += gameState.players[pos].faceUp.value;
    } else if (gameState.players[pos].faceUp > 3 && gameState.players[pos].faceUp <= 6) {   // carte 4 - 6
        let index = Math.floor(Math.random() * gameState.players.length)
        while (index == pos || !gameState.players[index].ws) {
            index = Math.floor(Math.random() * gameState.players.length);
        }
        if (gameState.players[index].drinkCanceled) {
            gameState.players[index].drinkCanceled = false;
            return;
        }
        if (gameState.players[index].doubleDrink) {
            gameState.players[index].drank += (gameState.players[pos].faceUp.value * 2);
            gameState.players[index].doubleDrink = false;
        } else {
            gameState.players[index].drank += gameState.players[pos].faceUp.value
        }
    } else if (gameState.players[pos].faceUp > 6 && gameState.players[pos].faceUp <= 8) {    // carte 6 - 8 = x2
        gameState.players[pos].doubleDrink = true;
    } else if (gameState.players[pos].faceUp > 8 && gameState.players[pos].faceUp <= 10) {   // carte 8 - 10 = canceled;
        gameState.players[index].drinkCanceled = true;
    } else if (gameState.players[pos].faceUp > 10 && gameState.players[pos].faceUp <= 13) { // Dame valet roi
        for (let i = 0; i < gameState.players.length; i++) {
            if (gameState.players[i].ws) {
                if (gameState.players[i].doubleDrink) {
                    gameState.players[i].drank += 2;
                } else if (gameState.players[i].drinkCanceled) {
                    gameState.players[i].drank += 0;
                } else {
                    gameState.players[i].drank += 1;
                }
            }
        }
    }
}

function pickCard(gameState, pos) {
    deckIsEmpty(gameState);
    if (gameState.players[pos].faceUp)
        gameState.nextDeck.push(gameState.players[pos].faceUp);
    gameState.players[pos].faceUp = gameState.deck.shift();
    gameState.hasPicked = true;
    eventCard(gameState, pos);
    gameState.picked = gameState.players[pos].faceUp;
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
    deckIsEmpty(gameState);
    card = gameState.deck.shift();
    total += card.value;
    gameState.nextDeck.push(card);
    deckIsEmpty(gameState);
    card = gameState.deck.shift();
    total += card.value;
    gameState.nextDeck.push(card);
    deckIsEmpty(gameState);
    card = null;

    if (total >= (RemainingPlayer * 10))
        gameState.picked = 42;
    else
        gameState.picked = 84;
}

module.exports = {
    endTurn,
    setRace,
    raceSelectedAll,
    pickCard,
    callChtulu
}