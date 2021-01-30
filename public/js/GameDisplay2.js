console.log(Phaser);

const SceneA = function() {};
SceneA.prototype.preload = function() {
    console.log(this);
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;
    this.stage.backgroundColor = 0x448844;
    // Assets
    this.load.spritesheet("card", "public/image/cards.png", 167, 243);
    // Username input
    const loginContainer = document.getElementById("login-container");
    const loginInput = document.createElement("input");
    loginInput.id = "login-input";
    loginContainer.appendChild(loginInput);
    const loginButton = document.createElement("button");
    loginButton.id = "login-button";
    loginButton.innerText = "Rejoindre la partie";
    loginContainer.appendChild(loginButton);
    loginButton.onclick = () => {
        console.log("CLICK", this.game.global.gameId, loginInput.value);
        loginContainer.innerHTML = '';
        this.game.global.gameClient = new GameClient(
            this.game.global.gameId, loginInput.value
        );
        this.state.start("SceneB");
    };
};
SceneA.prototype.create = function() {
    console.log("SCENEA create begin");
    this.background = this.add.sprite(10, 10, "card", 0);
    console.log("SCENEA create end");
};

const SceneB = function() {};
SceneB.prototype.preload = function() {
    this.game.global.gameClient.onPlayerUpdate = () => {
        console.log("player updated");
    };
    this.game.global.gameClient.onGameUpdate = () => {
        console.log("game updated");
    };
    console.log("SCENEB preload begin");
    this.load.spritesheet("background", "public/image/background.jpg", {frameWidth: 1920, frameHeight: 1080});
    console.log("SCENEB preload end");
};

SceneB.prototype.create = function() {
    console.log("SCENEB create begin");
    this.background = this.add.sprite(0, 0, "background", 0);
    this.input.onDown.add(function () {
        this.game.global.gameClient.start();
    }, this);
    console.log("SCENEB create end");
};

const startDisplay = (gameId) => {
    var config = {
        type: Phaser.AUTO,
        width: 1920,
        height: 1080,
    };
    const game = new Phaser.Game(config);

    game.global = {
        gameId,
        gameClient: null,
    };

    game.state.add("SceneA", SceneA);
    game.state.add("SceneB", SceneB);
    game.state.start("SceneA");

    return game;
};
