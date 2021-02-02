const eventGame = require('./events');
const cardFct = require('./cards');

class Game {
    constructor(uuid) {
        console.log("Game created", uuid);
        this.uuid = uuid;
        this.created = Date.now();
        this.started = false;
        this.players = [];
        this.playing = 0;
        this.hasPicked = false;
        this.nextDeck = [];
        this.deck = cardFct.shuffle(cardFct.createDeck());
        this.picked = null;
    }

    close() {
        console.log("Closing game " + this.uuid);
        this.players.forEach((player) => {
            if (player.ws) player.ws.sendError("La partie a été fermée de force par le serveur", true);
            player.ws = null;
        });
    }

    sendPlayerData() {
        const data = this.players.map((player) => ({
            username: player.username,
            connected: !!player.ws,
            race: player.race,
            faceUp: player.faceUp,
            drank: player.drank,
            drinkCanceled: player.drinkCanceled,
            doubleDrink: player.doubleDrink,
        }));
        const total = this.players.length;
        const connected = this.players.filter(el => !!el.ws).length;
        const faceUpConnected = this.players.filter(el => el.ws && el.faceUp).length;

        this.players.forEach((player) => {
            if (player.ws) player.ws.sendMessage('players', {list: data, total, connected, faceUpConnected});
        });
    }

    addPlayer(ws) {
        if (this.started) {
            return ws.sendError("La partie a déjà démarré", true);
        }
        if (this.players.length >= 10) {
            return ws.sendError("La partie est pleine", true);
        }
        for (const player of this.players) {
            if (player.username === ws.username) {
                return ws.sendError("Pseudonyme déjà utilisé", true);
            }
        }
        this.players.push({
            ws,
            uuid: ws.uuid,
            username: ws.username,
            race: "nain", faceUp: null,
            drank: 10, drinkCanceled: false, doubleDrink: false
        });
        this.sendPlayerData();
    }

    removePlayer(ws) {
        if (this.started) {
            for (const player of this.players) {
                if (player.uuid === ws.uuid) {
                    player.ws = null;
                    if (this.players[this.playing].uuid === ws.uuid) {
                        for (let i = 1; i < this.players.length; i++) {
                            if (this.players[(this.playing + i) % this.players.length].ws) {
                                this.playing = (this.playing + i) % this.players.length;
                                this.sendEnd();
                                break;
                            }
                        }
                    }
                }
            }
        } else {
            for (let i = 0; i < this.players.length; i++) {
                if (ws.uuid === this.players[i].uuid) {
                    this.players.splice(i, 1);
                }
            }
        }
        this.sendPlayerData();
    }

    sendPick(obj) {
        const play = this.playing;
        const card = this.picked;

        obj = obj.filter(el => el.drink !== 0);

        this.players.forEach((player) => {
            if (player.ws) player.ws.sendMessage('pick', {player: play, card, drink: obj});
        });
    }

    sendPower(obj) {
        console.log(obj);
        obj = obj.filter(el => el.drink !== 0);
        console.log(obj);
        const play = this.playing;

        this.sendPlayerData();
        this.players.forEach((player) => {
            if (player.ws) player.ws.sendMessage('sendPower', {player: play, drink: obj});
        });
    }

    sendPickChtulu(total, need) {

        const play = this.playing;
        const card = this.picked;

        this.players.forEach((player) => {
            if (player.ws) player.ws.sendMessage('callChtulu', {player: play, card, total, need});
        });
    }

    sendEnd() {
        this.sendPlayerData();
        this.players.forEach((player) => {
            if (player.ws) player.ws.sendMessage('endTurn', {player: this.playing});
        });
    }

    getPlayerPos(ws) {
        for (let i = 0; i < this.players.length; i++) {
            if (this.players[i].uuid === ws.uuid) {
                return i;
            }
        }
    }

    messageReceived(ws, msg) {
        const pos = this.getPlayerPos(ws);
        console.log("Player messaged", pos, msg);


        if (!this.started) {
            if (msg.type === "start") {
                if (this.players.length < 2) {
                    return ws.sendError("Deux joueurs au moins sont nécéssaires", false);
                } else {
                    this.started = true;
                    return this.sendEnd();
                }
            } else if (msg.type === "pickRace") {
                eventGame.setRace(this, pos, msg.data);
                return this.sendPlayerData();
            } else {
                return ws.sendError("Type de message invalide", false);
            }
        } else {
            if (pos !== this.playing) {
                return ws.sendError("Ce n'est pas à ton tour de jouer", false);
            } else if (msg.type === "sendPower") {
                if (this.players[pos].drank >= 10) {
                    this.players[pos].drank = 0;
                    const obj = eventGame.eventRace(this, pos);
                    return (this.sendPower(obj));
                }
                return ws.sendError("Tu n'as pas assez d'energie", false);
            } else if (msg.type === "pick") {
                let obj = eventGame.pickCard(this, pos);
                return this.sendPick(obj);
            } else if (msg.type === "callChtulu") {
                let total = eventGame.callChtulu(this, pos);
                let need = eventGame.getNeed(this);
                for (let i = 0; i < this.players.length; i++) {
                    if (this.players[i].faceUp)
                        this.nextDeck.push(this.players[i].faceUp);
                    this.players[i].faceUp = null;
                }
                return this.sendPickChtulu(total, need);
            } else if (msg.type === "endTurn") {
                eventGame.endTurn(this);
                return this.sendEnd();
            } else {
                return ws.sendError("Type de message invalide", false);
            }
        }
    }
}

module.exports = {
    Game
};
