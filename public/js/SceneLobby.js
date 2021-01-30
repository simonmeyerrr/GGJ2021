const SceneLobby = function() {};

SceneLobby.prototype.preload = function() {
    console.log("Preload Scene Lobby");
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

SceneLobby.prototype.create = function() {
    console.log("Create Scene Lobby");
    const global = this.game.global;

    this.background = this.add.sprite(0, 0, "background", 0);

    this.input.onDown.add(() => {
        global.gameClient.start();
    });
};
