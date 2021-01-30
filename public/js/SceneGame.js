const posPlayerinfo = [
    {
        card: {
            x: 345,
            y: 675,
            rotation: 0.27
        },
        name: {
            x: 100,
            y: 1020,
        },
        skin: {
            x: 100,
            y: 850
        }
    },
    {
        card: {
            x: 480,
            y: 725,
            rotation: 0.2
        },
        name: {
            x: 275,
            y: 1020,
        },
        skin: {
            x: 275,
            y: 850
        }
    },
    {
        card: {
            x: 615,
            y: 750,
            rotation: 0.08
        },
        name: {
            x: 450,
            y: 1020,
        },
        skin: {
            x: 450,
            y: 850
        }
    },
    {
        card: {
            x: 750,
            y: 775,
            rotation: 0.0
        },
        name: {
            x: 625,
            y: 1020,
        },
        skin: {
            x: 625,
            y: 850
        }
    },
    {
        card: {
            x: 885,
            y: 775,
            rotation: 0.0
        },
        name: {
            x: 800,
            y: 1020,
        },
        skin: {
            x: 800,
            y: 850
        }
    },
    {
        card: {
            x: 1020,
            y: 775,
            rotation: 0.0
        },
        name: {
            x: 975,
            y: 1020,
        },
        skin: {
            x: 975,
            y: 850
        }
    },
    {
        card: {
            x: 1155,
            y: 775,
            rotation: 0.0
        },
        name: {
            x: 1150,
            y: 1020,
        },
        skin: {
            x: 1150,
            y: 850
        }
    },
    {
        card: {
            x: 1290,
            y: 750,
            rotation: -0.08
        },
        name: {
            x: 1325,
            y: 1020,
        },
        skin: {
            x: 1325,
            y: 850
        }
    },
    {
        card: {
            x: 1425,
            y: 725,
            rotation: -0.2
        },
        name: {
            x: 1500,
            y: 1020,
        },
        skin: {
            x: 1500,
            y: 850
        }
    },
    {
        card: {
            x: 1560,
            y: 700,
            rotation: -0.27
        },
        name: {
            x: 1675,
            y: 1020,
        },
        skin: {
            x: 1675,
            y: 850
        }
    },
]

const SceneGame = function() {};

SceneGame.prototype.preload = function() {
    console.log("Preload Scene Game");
    const global = this.game.global;
    // Load assets
    this.load.spritesheet("card", "public/image/cards.png", 81, 117);
    this.load.spritesheet("skin", "public/resources/mermaid.png", {frameWidth: 500, frameHeight: 500});
    this.load.spritesheet("background", "public/image/background.png", {frameWidth: 1920, frameHeight: 1080});
};

SceneGame.prototype.displayPlayerData = function() {
    const global = this.game.global;
    const players = global.gameClient.players;
    for (let i = 0; i < players.length; i++) {
        if (i === global.gameClient.myPlayerNb) {
            if (!players[i].faceUp) {
                this.cards[i].frame = 52;
            } else {
                let frame = 0;
                frame += players[i].faceUp.value - 1;
                frame += 13 * (players[i].faceUp.color === 'C' ? 0 : players[i].faceUp.color === 'D' ? 1 : players[i].faceUp.color === 'H' ? 2 : 3)
                this.cards[i].frame = frame
            }
            this.texts[i].setText(players[i].username);
            this
        } else if (players[i].connected) {
            if (!players[i].faceUp) {
                this.cards[i].frame = 52;
            } else {
                let frame = 0;
                frame += players[i].faceUp.value - 1;
                frame += 13 * (players[i].faceUp.color === 'C' ? 0 : players[i].faceUp.color === 'D' ? 1 : players[i].faceUp.color === 'H' ? 2 : 3)
                this.cards[i].frame = frame
            }
            this.texts[i].setText(players[i].username);
            console.log("other player", i, players[i]);
        } else {
            this.cards[i].frame = 55;
        }
    }
};

SceneGame.prototype.displayGameData = function() {
    // TODO
};

SceneGame.prototype.displayError = function() {
    this.elems.errorMessage.setText(this.game.global.gameClient.error);
    this.elems.errorMessage.alpha = 1;
    this.time.events.add(2000, () => {
        this.add.tween(this.elems.errorMessage).to({}, 1500, Phaser.Easing.Linear.None, true);
        this.add.tween(this.elems.errorMessage).to({alpha: 0}, 1500, Phaser.Easing.Linear.None, true);
    });
};

SceneGame.prototype.create = function() {
    console.log("Create Scene Game");
    const global = this.game.global;

    this.background = this.add.sprite(0, 0, "background", 0);
    this.texts = [];
    this.cards = [];
    this.skins = [];
    for (let i = 0; i < 10; ++i) {
        let skin = this.add.sprite(posPlayerinfo[i].skin.x, posPlayerinfo[i].skin.y, "skin");
        skin.scale.setTo(0.40, 0.40);
        this.skins.push(skin);
        let card = this.add.sprite(posPlayerinfo[i].card.x, posPlayerinfo[i].card.y, "card", 55);
        card.rotation = posPlayerinfo[i].card.rotation
        this.cards.push(card);
        let text = this.add.text(posPlayerinfo[i].name.x, posPlayerinfo[i].name.y, "jean-cule", {
            font: "40px ManicSea",
            fill: "#0e0b0b",
            align: "center",
        });
        this.texts.push(text);
    }
    this.elems = {
        errorMessage: this.add.text(0, 0, "", {
            font: "65px ManicSea", fill: "#ff0000",
            boundsAlignH: "center", boundsAlignV: "middle",
        }).setTextBounds(0, 600, 1980, 600),
    };

    // Set callback
    global.gameClient.onPlayerUpdate = () => this.displayPlayerData();
    this.displayPlayerData();
    global.gameClient.onGameUpdate = () => this.displayGameData();
    this.displayGameData();
    global.gameClient.onError = () => this.displayError();
    if (global.gameClient.error) this.displayError();
};
