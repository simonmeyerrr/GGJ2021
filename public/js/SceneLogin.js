const SceneLogin = function() {};

SceneLogin.prototype.preload = function() {
    console.log("Preload Scene Login");
    const global = this.game.global;
    // Setup scaling
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;
    this.stage.backgroundColor = 0x448844;
    // Load assets
    this.load.spritesheet("background", "public/image/background.jpg", {frameWidth: 1920, frameHeight: 1080});
};

SceneLogin.prototype.create = function() {
    console.log("Create Scene Login");
    const global = this.game.global;

    this.background = this.add.sprite(0, 0, "background", 0);

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
        this.state.start("SceneLobby");
    };
};
