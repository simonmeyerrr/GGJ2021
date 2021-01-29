class Game {
    constructor(uuid) {
        console.log("Game created", uuid);
        this.uuid = uuid;
        this.created = Date.now();
        this.started = false;
        this.players = [];
        this.playing = 0;
    }

    sendPlayerData() {
        const data = this.players.map((player) => ({
           username: player.username,
           connected: !!player.ws,
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
            race: null, faceUp: null,
        });
        this.sendPlayerData();
    }

    removePlayer(ws) {
        if (this.started) {
            for (const player of this.players) {
                if (player.uuid === ws.uuid) {
                    player.ws = null;
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

    sendUpdateGame() {
        // envoie les infos a tous les joueurs
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
                // check si la game peut start (race selected)
                this.started = true;
                return this.sendUpdateGame();
            } else if (msg.type === "pickRace") {
                // set la race
                this.sendPlayerData();
            } else {
                return ws.sendError("invalid message type", false);
            }
        } else {
            if (pos !== this.playing) {
                return ws.sendError("not your turn to play", false);
            } else if (msg.type === "pick") {
                // tire la carte, l'applique
                return this.sendUpdateGame();
            } else if (msg.type === "callChtulu") {
                // tire la carte, l'applique
                return this.sendUpdateGame();
            } else if (msg.type === "endTurn") {
                // calcul le joueur suivant
                return this.sendUpdateGame();
            } else {
                return ws.sendError("invalid message type", false);
            }
        }
    }
}

module.exports = {
    Game
};
