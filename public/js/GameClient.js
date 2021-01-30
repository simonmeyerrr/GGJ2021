class GameClient {
    constructor(gameId, username) {
        this.gameId = gameId;
        this.username = username;
        this.myPlayerNb = -1;
        this.players = [];
        this.lastEvent = null;
        this.error = null;

        this.onPlayerUpdate = null;
        this.onGameUpdate = null;

        this._initWebsocket();
    }

    isOpen() {
        return this._ws !== null;
    }

    start() {
        this._sendMessage("start");
    }

    chooseRace(race) {
        this._sendMessage("pickRace", race);
    }

    pick() {
        this._sendMessage("pick");
    }

    callChtulu() {
        this._sendMessage("callChtulu");
    }

    endTurn() {
        this._sendMessage("endTurn");
    }

    _initWebsocket() {
        this._ws = new WebSocket(
            window.location.protocol === "https:" ? 'wss' : 'ws' +
                '://' + window.location.hostname + ':' + window.location.port + '/api/game/' + this.gameId
        );
        this._ws.onerror = (err) => {
            console.log("Error occurred", {err});
            this._ws.close();
            this._ws = null;
        };
        this._ws.onclose = () => {
            console.log("Connection closed");
            this._ws = null;
        };
        this._ws.onopen = () => {
            console.log("Connection opened");
            this._sendMessage("join", {username: this.username});
        };
        this._ws.onmessage = (msg) => {
            this._manageMessage(JSON.parse(msg.data));
        }
    }

    _sendMessage(type, data) {
        if (this._ws) this._ws.send(JSON.stringify({type, data}));
    }

    _manageMessage(msg) {
        console.log("MESSAGE", msg);
        if (msg.type === "players") {
            const old = this.players;
            this.players = msg.data.list;
            for (let i = 0; i < this.players.length; i++) {
                if (this.players[i].username === this.username)
                    this.myPlayerNb = i;
            }
            if (this.onPlayerUpdate) this.onPlayerUpdate(this.players, old);
        } else if (msg.type === "endTurn" || msg.type === "pick" || msg.type === "callChtulu") {
            const old = this.lastEvent;
            this.lastEvent = msg;
            if (this.onGameUpdate) this.onGameUpdate(this.lastEvent, old);
/*
            if (msg.type === "endTurn" && msg.data.player === this.myPlayerNb) {
                this.pick();
                setTimeout(() => this.endTurn(), 1000);
            }
*/
        } else if (msg.type === "error") {
            console.log("error", msg);
            this.error = msg.message;
        } else {
            console.log("unknown message", msg);
        }
    }
}
