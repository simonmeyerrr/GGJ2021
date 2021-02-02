const cardFct = require('./cards');

function deckIsEmpty(gameState) {
    if (gameState.deck.length === 0) {
        gameState.deck = cardFct.shuffle(gameState.nextDeck);
        gameState.nextDeck = [];
    }
}

function endTurn(gameState) {
    if (gameState.hasPicked === true) {
        gameState.hasPicked = false;
        while (1) {
            let i = 0;
            gameState.playing = (gameState.playing + 1) % gameState.players.length;
            if (gameState.players[gameState.playing].ws) {
                break;
            } else if (i >= (gameState.players.length + 1)) {
                gameState.playing = -1;
                break;
            }
            i++;
        }
    }
}

function setRace(gameState, pos, race) {
    gameState.players[pos].race = race;
}

function raceSelectedAll(gameState) {
    for (let i = 0; i < gameState.players.length; i++) {
        if (gameState.players[i].race == null && gameState.players[i].ws) {
            return false;
        }
    }
    return true;
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
    let index = Math.floor(Math.random() * gameState.players.length);

    let connected = gameState.players.reduce((occ, cur) => occ + (!cur.ws ? 0 : 1), 0);
    while (!gameState.players[index].ws && connected > 0) {
        index = Math.floor(Math.random() * gameState.players.length);
        connected = gameState.players.reduce((occ, cur) => occ + (!cur.ws ? 0 : 1), 0);
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
        gameState.players[index].drank += gameState.players[pos].faceUp.value;
        return (obj);
    }
}

function card1113(gameState, pos, obj) {
    for (let i = 0; i < gameState.players.length; i++) {
        if (gameState.players[i].ws && pos !== i) {
            if (gameState.players[i].doubleDrink === true) {
                obj[i].drink += (gameState.players[pos].faceUp.value - 10) * 2;
                gameState.players[i].drank += (gameState.players[pos].faceUp.value - 10) * 2;
                gameState.players[i].doubleDrink = false;
            } else if (gameState.players[i].drinkCanceled === true) {
                gameState.players[i].drinkCanceled = false;
            } else {
                obj[i].drink += gameState.players[pos].faceUp.value - 10;
                gameState.players[i].drank += gameState.players[pos].faceUp.value - 10;
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
        gameState.players[pos].drinkCanceled = false;
    } else if (gameState.players[pos].faceUp.value > 8 && gameState.players[pos].faceUp.value <= 10) {
        gameState.players[pos].doubleDrink = false;
        gameState.players[pos].drinkCanceled = true;
    } else if (gameState.players[pos].faceUp.value > 10 && gameState.players[pos].faceUp.value <= 13) {
       obj = card1113(gameState, pos, obj);
    }
    return (obj);
}

function eventRace(gameState, pos) {
    let obj = gameState.players.map((player, key) => ({
        player: key, drink: 0,
    }));
    const ev = gameState.players[pos].race;
    if (ev === "siren") {
        obj = siren(gameState, pos, obj);
    } else if (ev === "orc") {
        obj = orc(gameState, pos, obj);
    } else if (ev === "gobelin") {
        obj = gobelin(gameState, pos, obj);
    } else if (ev === "mage") {
        obj = mage(gameState, pos, obj);
    } else if (ev === "elf") {
        obj = elf(gameState, pos, obj);
    } else if (ev === "nain") {
        obj = nain(gameState, pos, obj);
    } else if (ev === "nain") {
        obj = nain(gameState, pos, obj);
    } else if (ev === "nain") {
        obj = nain(gameState, pos, obj);
    } else if (ev === "king") {
        obj = king(gameState, pos, obj);
    } else if (ev === "medusa") {
        obj = medusa(gameState, pos, obj);
    } else if (ev === "barman") {
        obj = barman(gameState, pos, obj);
    } else if (ev === "necro") {
        obj = necro(gameState, pos, obj);
    } else if (ev === "skeleton") {
        obj = skeleton(gameState, pos, obj);
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
    if (gameState.players[pos].faceUp)
        gameState.nextDeck.push(gameState.players[pos].faceUp);
    gameState.players[pos].faceUp = gameState.deck.shift();
    gameState.hasPicked = true;
    gameState.picked = gameState.players[pos].faceUp;
    total += gameState.picked.value;
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

function nain(gameState, pos, obj) {
    if (gameState.players[pos].race === "nain") {
        for (let i = 0; i < gameState.players.length; i++) {
            if (gameState.players[i].ws && gameState.players[i].race === "nain") {
                obj[i].drink = 5;
            }
        }
    }
    return (obj);
}

function siren(gameState, pos, obj) {
    if (gameState.players[pos].race === "siren") {
        gameState.players[pos].drinkCanceled = true;
        gameState.players[pos].doubleDrink = false;
    }
    return (obj);
}

function gobelin(gameState, pos, obj) {
    if (gameState.players[pos].race === "gobelin") {
        for (let i = 0; i < gameState.players.length; i++) {
            if (i !== pos && gameState.players[i].ws) {
                obj[i].drink = 2;
            }
        }
    }
    return (obj);
}

function orc(gameState, pos, obj) {
    let index = Math.floor(Math.random() * gameState.players.length);

    if (gameState.players[pos].race === "orc") {
        let connected = gameState.players.reduce((occ, cur) => occ + (!cur.ws ? 0 : 1), 0);
        while (!gameState.players[index].ws && connected > 0) {
            index = Math.floor(Math.random() * gameState.players.length);
            connected = gameState.players.reduce((occ, cur) => occ + (!cur.ws ? 0 : 1), 0);
        }
        obj[index].drink = 10;
    }
    return (obj);
}

function mage(gameState, pos, obj) {
    if (gameState.players[pos].race === "mage") {
        for (let i = 0; i < gameState.players.length; i++) {
            if (i !== pos && gameState.players[i].ws) {
                if (gameState.players[pos].drinkCanceled) {
                    gameState.players[pos].drinkCanceled = false;
                }
            }
        }
    }
    return (obj);
}

function elf(gameState, pos, obj) {
    if (gameState.players[pos].race === "elf") {
        for (let i = 0; i < gameState.players.length; i++) {
            if (i !== pos && gameState.players[i].ws) {
                gameState.players[i].doubleDrink = true;
                gameState.players[i].drinkCanceled = false;
            }
        }
    }
    return (obj);
}

function king(gameState, pos, obj) {
    if (gameState.players[pos].race === "king") {
        for (let i = 0; i < gameState.players.length; i++) {
            if (i !== pos && gameState.players[i].ws) {
                gameState.players[i].drank = 0;
            }
        }
    }
    return (obj);
}

function medusa(gameState, pos, obj) {
    if (gameState.players[pos].race === "medusa") {
        for (let i = 0; i < gameState.players.length; i++) {
            if (i !== pos && gameState.players[i].ws) {
                if (["mage", "elf", "nain", "king", "barman", "necro"].includes(gameState.players[i].race))
                    obj[i].drink = 4;
            }
        }
    }
    return (obj);
}

function barman(gameState, pos, obj) {
    if (gameState.players[pos].race === "barman") {
        for (let i = 0; i < gameState.players.length; i++) {
            if (i !== pos && gameState.players[i].ws) {
                gameState.players[i].drank = 10;
            }
        }
    }
    return (obj);
}

function necro(gameState, pos, obj) {
    let index = Math.floor(Math.random() * gameState.players.length);

    if (gameState.players[pos].race === "necro") {
        let connected = gameState.players.reduce((occ, cur) => occ + (!cur.ws ? 0 : 1), 0);
        while ((!gameState.players[index].ws && connected > 0) || gameState.players[index].race === "necro") {
            index = Math.floor(Math.random() * gameState.players.length);
            connected = gameState.players.reduce((occ, cur) => occ + (!cur.ws ? 0 : 1), 0);
        }
        gameState.players[index].race = "skeleton";
        obj[index].drink = 1;
    }
    return (obj);
}

function skeleton(gameState, pos, obj) {
    let index = Math.floor(Math.random() * gameState.players.length);

    if (gameState.players[pos].race === "skeleton") {
        let connected = gameState.players.reduce((occ, cur) => occ + (!cur.ws ? 0 : 1), 0);
        while ((!gameState.players[index].ws && connected > 0) || gameState.players[index].race === "skeleton") {
            index = Math.floor(Math.random() * gameState.players.length);
            connected = gameState.players.reduce((occ, cur) => occ + (!cur.ws ? 0 : 1), 0);
        }
        obj[index].drink = 7;
        gameState.players[pos].drinkCanceled = false;
        gameState.players[pos].doubleDrink = true;
    }
    return (obj);
}


module.exports = {
    endTurn,
    setRace,
    pickCard,
    callChtulu,
    getNeed,
    eventRace
};
