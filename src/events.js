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

function card13(gameState, pos, obj) {
    if (gameState.players[pos].drinkCanceled === true) {
        gameState.players[pos].drinkCanceled = false;
        return (obj);
    } else if (gameState.players[pos].doubleDrink === true) {
        gameState.players[pos].drank += (gameState.players[pos].faceUp.value * 2);
        obj[pos].drink += (gameState.players[pos].faceUp.value * 2);
        gameState.players[pos].doubleDrink = false;
        return (obj);
    } else {
        gameState.players[pos].drank += gameState.players[pos].faceUp.value;
        obj[pos].drink += gameState.players[pos].faceUp.value;
        return (obj);
    }
}

function card46(gameState, pos, obj) {
    let index = Math.floor(Math.random() * gameState.players.length)

    while (index == pos || !gameState.players[index].ws) {
        index = Math.floor(Math.random() * gameState.players.length);
    }
    if (gameState.players[index].drinkCanceled === true) {
        gameState.players[index].drinkCanceled = false;
        return (obj);
    }
    else if (gameState.players[index].doubleDrink === true) {
        obj[index].drink += (gameState.players[pos].faceUp.value * 2);
        gameState.players[index].drank += (gameState.players[pos].faceUp.value * 2);
        gameState.players[index].doubleDrink = false;
        return (obj);
    } else {
        obj[index].drink += gameState.players[pos].faceUp.value;
        gameState.players[index].drank += gameState.players[pos].faceUp.value
        return (obj);
    }
}

function card1113(gameState, pos, obj) {
    for (let i = 0; i < gameState.players.length; i++) {
        if (gameState.players[i].ws && pos != i) {
            if (gameState.players[i].doubleDrink === true) {
                obj[i].drink += 2;
                gameState.players[i].drank += 2;
                gameState.players[i].doubleDrink = false;
            } else if (gameState.players[i].drinkCanceled === true) {
                obj[i].drink += 0;
                gameState.players[i].drank += 0;
                gameState.players[i].drinkCanceled = false;
            } else {
                obj[i].drink += 1;
                gameState.players[i].drank += 1;
            }
        }
    }
    return (obj)
}

function eventCard(gameState, pos) {
    
    let obj = gameState.players.map((player, key) => ({
        player: key, drink: 0
    }));

    if (gameState.players[pos].faceUp.value <= 3) {
        obj = card13(gameState, pos, obj);
    } else if (gameState.players[pos].faceUp.value > 3 && gameState.players[pos].faceUp.value <= 6) {
        obj = card46(gameState, pos, obj);
    } else if (gameState.players[pos].faceUp.value > 6 && gameState.players[pos].faceUp.value <= 8) {
        gameState.players[pos].doubleDrink = true;
    } else if (gameState.players[pos].faceUp.value > 8 && gameState.players[pos].faceUp.value <= 10) {
        gameState.players[pos].drinkCanceled = true;
    } else if (gameState.players[pos].faceUp.value > 10 && gameState.players[pos].faceUp.value <= 13) {
       obj = card1113(gameState, pos, obj);
    }
    return (obj);
}

function pickCard(gameState, pos) {
    deckIsEmpty(gameState);
    if (gameState.players[pos].faceUp)
        gameState.nextDeck.push(gameState.players[pos].faceUp);
    gameState.players[pos].faceUp = gameState.deck.shift();
    gameState.hasPicked = true;
    const obj = eventCard(gameState, pos);
    gameState.picked = gameState.players[pos].faceUp;
    return obj;
}

function callChtulu(gameState, pos) {
    let RemainingPlayer = gameState.players.length;
    let total = 0;

    for (let i = 0; i < gameState.players.length; i++) {
        if (!gameState.players[i].ws)
            RemainingPlayer--;
        else
            total += gameState.players[i].faceUp.value;
    }
    deckIsEmpty(gameState);
    pickCard(gameState, pos);
    total += gameState.picked.value
    return (total);
}

function getNeed(gameState) {
    let needed = gameState.players.length;

    for (let i = 0; i < gameState.players.length; i++) {
        if (!gameState.players[i].ws)
            needed--;
    }
    return (needed * 10);
}

module.exports = {
    endTurn,
    setRace,
    raceSelectedAll,
    pickCard,
    callChtulu,
    getNeed
}
