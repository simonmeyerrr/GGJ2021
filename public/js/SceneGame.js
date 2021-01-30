const SceneGame = function() {};

SceneGame.prototype.preload = function() {
    console.log("Preload Scene Game");
    const global = this.game.global;
    // Load assets
    this.load.spritesheet("background", "public/image/background.jpg", {frameWidth: 1920, frameHeight: 1080});
};

SceneGame.prototype.displayPlayerData = function() {
    const global = this.game.global;
    const players = global.gameClient.players;
    for (let i = 0; i < players.length; i++) {
        if (i === global.gameClient.myPlayerNb) {
            console.log("me", i, players[i]);
        } else if (players[i].connected) {
            console.log("other player", i, players[i]);
        }
    }
};

SceneGame.prototype.displayGameData = function() {
    // TODO
};

SceneGame.prototype.create = function() {
    console.log("Create Scene Game");
    const global = this.game.global;

    this.background = this.add.sprite(0, 0, "background", 0);

    // Set callback
    global.gameClient.onPlayerUpdate = () => {
        this.displayPlayerData();
    };
    global.gameClient.onGameUpdate = () => {
        this.displayGameData();
    };
    this.displayPlayerData();
    this.displayGameData();
};
