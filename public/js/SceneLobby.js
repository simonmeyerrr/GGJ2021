const SceneLobby = function() {};

SceneLobby.prototype.preload = function() {
    console.log("Preload Scene Lobby");
    // Load assets
    this.load.spritesheet("background", "public/resources/wpp.jpg", {frameWidth: 1920, frameHeight: 1080});
    this.load.spritesheet('buttonRight', 'public/image/right.png', 108, 116);
    this.load.spritesheet('buttonLeft', 'public/image/left.png', 108, 116);
    this.load.spritesheet('avatars', 'public/image/avatars.png', 500, 500);
};

const actionStart = function() {
    this.game.global.gameClient.start();
    this.state.start("SceneGame");
};

const actionInvite = function() {
    return navigator.clipboard.writeText(window.location);
};

SceneLobby.prototype.displayPlayerData = function() {
    // TODO
};

SceneLobby.prototype.displayError = function() {
    console.log("EEEEEEEEEEEEEERRR", this.game.global.gameClient.error);
    // TODO
};

SceneLobby.prototype.nextAvatar = function() {
    this.elems.avatar.frame++;
};

SceneLobby.prototype.prevAvatar = function() {
    this.elems.avatar.frame--;
};

SceneLobby.prototype.create = function() {
    console.log("Create Scene Lobby");
    const global = this.game.global;

    this.elems = {
        background: this.add.sprite(0, 0, "background", 0),
        buttonNext: this.add.button(this.world.centerX - 54 + 300, 250, "buttonRight", this.nextAvatar, this, 2, 1, 0),
        buttonPrev: this.add.button(this.world.centerX - 54 - 300, 250, "buttonLeft", this.prevAvatar, this, 2, 1, 0),
        avatar: this.add.sprite(this.world.centerX - 250, 80, "avatars", 0),
        buttonStart: this.add.button(this.world.centerX - 95, 400, 'buttonRight', actionStart, this, 2, 1, 0),
        buttonInvite: this.add.button(this.world.centerX - 95, 600, 'buttonLeft', actionInvite, this, 2, 1, 0),
    };

    const loginContainer = document.getElementById("login-container");
    loginContainer.style.display = "none";


    // Set callback
    global.gameClient.onPlayerUpdate = () => this.displayPlayerData();
    this.displayPlayerData();
    global.gameClient.onGameUpdate = () => this.state.start("SceneGame");
    if (global.gameClient.lastEvent) this.state.start("SceneGame");
    global.gameClient.onError = () => this.displayError();
    if (global.gameClient.error) this.displayError();
};
