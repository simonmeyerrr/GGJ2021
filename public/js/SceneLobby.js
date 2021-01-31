
const avatar_frame = {
    "gobelin": 0,
    "orc": 1,
    "siren": 2,
    "mage": 3,
    "elf": 4,
    "nain": 5
}

const avatar_name = {
    0: "gobelin",
    1: "orc",
    2: "siren",
    3: "mage",
    4: "elf",
    5: "nain",
}

const avatar_desc = {
    "gobelin": "Mesquin et diabolique, le Gobelin pourra distribuer 2\ngorgées à tout les joueurs !",
    "orc": "Bourru, l'Orc distribue 10 gorgées à un joueur aléatoire (y \ncompris lui). Point Barre.",
    "siren": "De part son agilité toute particulière, la Sirène pourra\nannuler son prochain nombre de gorgées.",
    "mage": "Si le Mage voit ses gorgées doublées au prochain tour, il\npeut l'annuler.",
    "elf": "L'Elf est vif, ainsi avant même que l'on s'en apperçoivent,\nl'Efle multipliera par deux toutes les prochaines gorgées\ndes autres joueurs.",
    "nain": "Alcoolique à outrance, le Nain peut s'octroyer 5 gorgées \nainsi qu'à tout ses confrères de petite taille."
}

const SceneLobby = function() {};

SceneLobby.prototype.preload = function() {
    console.log("Preload Scene Lobby");
    // Load assets
    this.load.spritesheet("background", "public/resources/wpp.jpg", {frameWidth: 1920, frameHeight: 1080});
    this.load.spritesheet('buttonRight', 'public/image/right.png', 108, 116);
    this.load.spritesheet('buttonLeft', 'public/image/left.png', 108, 116);
    this.load.spritesheet('buttonValid', 'public/image/valid.png', 108, 116);
    this.load.spritesheet('buttonShare', 'public/image/share.png', 108, 116);
    this.load.spritesheet('avatars', 'public/image/avatars.png', 500, 500);
    this.load.spritesheet('desc', 'public/image/desc.png', 818.8, 173);
};

const actionStart = function() {
    this.game.global.gameClient.start();
    this.state.start("SceneGame");
};

const actionInvite = function() {
    return navigator.clipboard.writeText(window.location);
};

SceneLobby.prototype.displayPlayerData = function() {
    let index = 0;
    for (let i = 0; i < 9; ++i) {
        if (i == this.game.global.gameClient.myPlayerNb) {
            continue;
        }
        const player = this.game.global.gameClient.players[i];
        if (!player) {
            this.players[index].avatar.visible = false;
            this.players[index].username.text = "";
            continue;
        }
        this.players[index].avatar.frame = avatar_frame[player.race];
        this.players[index].avatar.visible = true;
        this.players[index].username.text = player.username;
        index++;
    }
};

SceneLobby.prototype.displayError = function() {
    this.elems.errorMessage.setText(this.game.global.gameClient.error);
    this.elems.errorMessage.alpha = 1;
    this.time.events.add(2000, () => {
        this.add.tween(this.elems.errorMessage).to({}, 1500, Phaser.Easing.Linear.None, true);
        this.add.tween(this.elems.errorMessage).to({alpha: 0}, 1500, Phaser.Easing.Linear.None, true);
    });
};

SceneLobby.prototype.nextAvatar = function() {
    const user = this.game.global.gameClient.players[this.game.global.gameClient.myPlayerNb];
    this.elems.avatar.frame++;
    this.elems.desc_img.frame++;
    this.game.global.gameClient.chooseRace(avatar_name[this.elems.avatar.frame]);
    this.elems.desc.text = avatar_desc[avatar_name[this.elems.avatar.frame]];
};

SceneLobby.prototype.prevAvatar = function() {
    const user = this.game.global.gameClient.players[this.game.global.gameClient.myPlayerNb];
    if (this.elems.avatar.frame == 0) {
        this.elems.avatar.frame = 5;
        this.elems.desc_img.frame = 5;
    } else {
        this.elems.avatar.frame--;
        this.elems.desc_img.frame--;
    }
    this.game.global.gameClient.chooseRace(avatar_name[this.elems.avatar.frame]);
    this.elems.desc.text = avatar_desc[avatar_name[this.elems.avatar.frame]];
};

SceneLobby.prototype.create = function() {
    const global = this.game.global;
    const user = global.gameClient.players[global.gameClient.myPlayerNb];

    this.elems = {
        errorMessage: this.add.text(0, 0, "", {
            font: "65px ManicSea", fill: "#ff0000",
            boundsAlignH: "center", boundsAlignV: "middle",
        }).setTextBounds(0, 600, 1980, 600),
        background: this.add.sprite(0, 0, "background", 0),
        buttonNext: this.add.button(this.world.centerX - 54 + 300, 250, "buttonRight", this.nextAvatar, this, 2, 1, 0),
        buttonPrev: this.add.button(this.world.centerX - 54 - 300, 250, "buttonLeft", this.prevAvatar, this, 2, 1, 0),
        avatar: this.add.sprite(this.world.centerX - 250, 80, "avatars", 0),
        desc_img: this.add.sprite(550, 550, "desc", 0),
        buttonInvite: this.add.button(50, 50, 'buttonShare', actionInvite, this, 2, 1, 0),
        buttonStart: this.add.button(50, 200, 'buttonValid', actionStart, this, 2, 1, 0),
        name: this.add.text(
            0, 0,
            user.username,
            {
                font: "60px ManicSea",
                fill: "white",
                textAlign: "center",
                boundsAlignH: "center"
            }
        ).setTextBounds(900, 10, 120, 50),
        desc: this.add.text(
            600, 580,
            "",
            {
                font: "30px ManicSea",
                fill: "black",
                textAlign: "center",
                boundsAlignH: "center"
            }
        ),
        launch: this.add.text(
            175, 235,
            "Lancer la partie",
            {
                font: "40px ManicSea",
                fill: "white",
                textAlign: "center",
                boundsAlignH: "center"
            }
        ),
        share: this.add.text(
            175, 85,
            "Copier le lien de la partie",
            {
                font: "40px ManicSea",
                fill: "white",
                textAlign: "center",
                boundsAlignH: "center"
            }
        ),
    };
    this.players = [];
    for (let i = 0; i < 9; ++i) {
        this.players.push({
            username: this.add.text(
                0, 0, "",
                {
                    font: "40px ManicSea",
                    fill: "white",
                    textAlign: "center",
                    boundsAlignH: "center"
                }
            ).setTextBounds(i * 210 + 3.3, 1030, 200, 50),
            avatar: this.add.sprite(i * 210 + 3.3, 850, "avatars", 0)
        });
        this.players[i].avatar.scale.setTo(0.4, 0.4);
        this.players[i].avatar.visible = false;
    }

    this.elems.avatar.frame = avatar_frame[user.race];
    this.elems.desc_img.frame = avatar_frame[user.race];
    this.elems.desc.text = avatar_desc[user.race];


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
