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
        this.onError = null;
        this.onDisconnect = null;

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

    power() {
        this._sendMessage("sendPower");
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
            (window.location.protocol === "https:" ? 'wss' : 'ws') +
                '://' + window.location.hostname + ':' + window.location.port + '/api/ws/' + this.gameId
        );
        this._ws.onerror = (err) => {
            this.error = err.toString();
            if (this.onError) this.onError(this.error);
            this._ws.close();
            this._ws = null;
        };
        this._ws.onclose = () => {
            this._ws = null;
            if (this.onDisconnect) this.onDisconnect();
        };
        this._ws.onopen = () => {
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
        console.log("RECEIVED", msg);
        if (msg.type === "players") {
            const old = this.players;
            this.players = msg.data.list;
            for (let i = 0; i < this.players.length; i++) {
                if (this.players[i].username === this.username)
                    this.myPlayerNb = i;
            }
            if (this.onPlayerUpdate) this.onPlayerUpdate(this.players, old);
        } else if (msg.type === "endTurn" || msg.type === "pick" || msg.type === "callChtulu" || msg.type === "sendPower") {
            const old = this.lastEvent;
            this.lastEvent = msg;
            if (this.onGameUpdate) this.onGameUpdate(this.lastEvent, old);
        } else if (msg.type === "error") {
            this.error = msg.data.message;
            if (this.onError) this.onError(this.error);
        } else {
            console.log("unknown message", msg);
        }
    }
}
