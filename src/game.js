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
        this.players.forEach((player) => {
            if (player.ws) player.ws.sendMessage('players', {list: data});
        });
    }

    addPlayer(ws) {
        if (this.started) {
            return ws.sendError("game already started", true);
        }
        if (this.players.length >= 12) {
            return ws.sendError("too many players in the game", true);
        }
        for (const player of this.players) {
            if (player.username === ws.username) {
                return ws.sendError("username already used", true);
            }
        }
        this.players.push({
            ws,
            uuid: ws.uuid,
            username: ws.username,
            race: 1, faceUp: null,
            drank: 0, drinkCanceled: false, doubleDrink: false
        });
        this.sendPlayerData();
    }

    removePlayer(ws) {
        if (this.started) {
            for (const player of this.players) {
                if (player.uuid === ws.uuid) {
                    player.ws = null;
                    if (this.players[this.playing].uuid == ws.uuid) {
                        while (1) {
                            this.playing = (this.playing + 1) % this.players.length;
                            if (this.players[this.playing].ws) {
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

        obj = obj.filter(el => el.drink != 0);

        this.players.forEach((player) => {
            player.ws.sendMessage('pick', {player: play, card, drink: obj});
        });
    }

    sendPickChtulu(total, need) {

        const play = this.playing;
        const card = this.picked;

        this.players.forEach((player) => {
            player.ws.sendMessage('pickChtulu', {player: play, card, total, need});
        });
    }

    sendEnd() {
        this.players.forEach((player) => {
            player.ws.sendMessage('endTurn', {player: this.playing});
            this.sendPlayerData();
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
                if (eventGame.raceSelectedAll(this)) {
                    this.started = true;
                    return this.sendEnd();
                } else {
                    return ws.sendError("Cannot start game, all race not selected", false);
                }
            } else if (msg.type === "pickRace") {
                eventGame.setRace(this, pos, msg.data);
                return this.sendPlayerData();
            } else {
                return ws.sendError("invalid message type", false);
            }
        } else {
            if (pos !== this.playing) {
                return ws.sendError("not your turn to play", false);
            } else if (msg.type === "pick") {
                let obj = eventGame.pickCard(this, pos);
                return this.sendPick(obj);
            } else if (msg.type === "callChtulu") {
                let total = eventGame.callChtulu(this, pos);
                let need = eventGame.getNeed(this);
                return this.sendPickChtulu(total, need);
            } else if (msg.type === "endTurn") {
                eventGame.endTurn(this);
                return this.sendEnd();
            } else {
                return ws.sendError("invalid message type", false);
            }
        }
    }
}

module.exports = {
    Game
};
