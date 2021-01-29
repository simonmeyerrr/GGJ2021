class Game {
    constructor(uuid) {
        console.log("Game created", uuid);
        this.uuid = uuid;
        this.created = Date.now();
    }

    addPlayer(ws) {
        console.log("Player added");
    }

    removePlayer(ws) {
        console.log("Player removed");
    }

    messageReceived(ws, msg) {
        console.log("Player messaged", msg);
    }
}

module.exports = {
    Game
};
