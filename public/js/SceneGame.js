const SceneGame = function() {};

SceneGame.prototype.preload = function() {
    console.log("Preload Scene Game");
    const global = this.game.global;
    // Set callback
    global.gameClient.onPlayerUpdate = () => {
        console.log("player updated");
    };
    global.gameClient.onGameUpdate = () => {
        console.log("game updated");
    };
    // Load assets
    this.load.spritesheet("background", "public/image/background.jpg", {frameWidth: 1920, frameHeight: 1080});
};

SceneGame.prototype.create = function() {
    console.log("Create Scene Game");
    const global = this.game.global;

    this.background = this.add.sprite(0, 0, "background", 0);
};
