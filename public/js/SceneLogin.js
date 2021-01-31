const SceneLogin = function() {};

SceneLogin.prototype.preload = function() {
    console.log("Preload Scene Login");
    const global = this.game.global;
    // Setup scaling
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;
    this.stage.backgroundColor = 0x000;
    // Load assets
    this.load.spritesheet("background", "public/resources/wpp.jpg", {frameWidth: 1920, frameHeight: 1080});
};

SceneLogin.prototype.displayError = function(err) {
    this.elems.errorMessage.setText(err);
    this.elems.errorMessage.alpha = 1;
    this.time.events.add(2000, () => {
        this.add.tween(this.elems.errorMessage).to({}, 1500, Phaser.Easing.Linear.None, true);
        this.add.tween(this.elems.errorMessage).to({alpha: 0}, 1500, Phaser.Easing.Linear.None, true);
    });
};

SceneLogin.prototype.create = function() {
    console.log("Create Scene Login");
    const global = this.game.global;

    this.elems = {
        background: this.add.sprite(0, 0, "background", 0),
        errorMessage: this.add.text(0, 0, "", {
            font: "65px ManicSea", fill: "#ff0000",
            boundsAlignH: "center", boundsAlignV: "middle",
        }).setTextBounds(0, 600, 1980, 600),
    };

    // Username input
    const loginContainer = document.getElementById("login-container");
    const loginTitle = document.createElement("h1");
    loginTitle.id = "login-title";
    loginTitle.innerText = "Quel est ton nom d'aventurier ?";
    loginContainer.appendChild(loginTitle);
    const loginInput = document.createElement("input");
    loginInput.id = "login-input";
    loginInput.maxLength = 10;
    loginContainer.appendChild(loginInput);
    const loginButton = document.createElement("button");
    loginButton.id = "login-button";
    loginButton.innerText = "Rejoindre la partie";
    loginButton.className = "btn btn-primary btn-lg";
    loginButton.type = "button";
    loginContainer.appendChild(loginButton);
    loginButton.onclick = () => {
        window.dispatchEvent(new Event('soundButton'));
        if (loginInput.value.length === 0) return;
        this.elems.errorMessage.setText("");
        this.game.global.gameClient = new GameClient(
            this.game.global.gameId, loginInput.value
        );
        this.game.global.gameClient.onPlayerUpdate = () => this.state.start("SceneLobby");
        if (this.game.global.gameClient.players.length !== 0) this.state.start("SceneLobby");
        this.game.global.gameClient.onError = (err) => this.displayError(err);
    };
};
