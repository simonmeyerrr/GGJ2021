const posPlayerinfo = [
    {
        card: {
            x: 345,
            y: 725,
            rotation: 0.3
        },
        name: {
            x: 150,
            y: 1000,
        }
    },
    {
        card: {
            x: 480,
            y: 775,
            rotation: 0.2
        },
        name: {
            x: 400,
            y: 950,
        }
    },
    {
        card: {
            x: 615,
            y: 800,
            rotation: 0.1
        },
        name: {
                x: 500,
            y: 1000,
        }
    },
    {
        card: {
            x: 750,
            y: 840,
            rotation: 0.1
        },
        name: {
            x: 1000,
            y: 900,
        }
    },
    {
        card: {
            x: 885,
            y: 840,
            rotation: 0.0
        },
        name: {
            x: 1100,
            y: 950,
        }
    },
    {
        card: {
            x: 1020,
            y: 840,
            rotation: 0.0
        },
        name: {
            x: 1200,
            y: 900,
        }
    },
    {
        card: {
            x: 1155,
            y: 840,
            rotation: -0.1
        },
        name: {
            x: 900,
            y: 950,
        }
    },
    {
        card: {
            x: 1290,
            y: 800,
            rotation: -0.1
        },
        name: {
            x: 1345,
            y: 950,
        }
    },
    {
        card: {
            x: 1425,
            y: 775,
            rotation: -0.2
        },
        name: {
            x: 1430,
            y: 900,
        }
    },
    {
        card: {
            x: 1560,
            y: 725,
            rotation: -0.3
        },
        name: {
            x: 1560,
            y: 950,
        }
    },
]

const SceneGame = function() {};

SceneGame.prototype.preload = function() {
    console.log("Preload Scene Game");
    const global = this.game.global;
    // Load assets
    this.load.spritesheet("card", "public/image/cards.png", 81, 117);
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
            this.cards[i].frame = 1;
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
    this.texts = [];
    this.cards = []
    for (let i = 0; i < 10; ++i) {
        console.log(posPlayerinfo[i].card.x)
        let card = this.add.sprite(posPlayerinfo[i].card.x, posPlayerinfo[i].card.y, "card", 1);
        // card.scale.setTo(1.5, 1.5);
        card.rotation = posPlayerinfo[i].card.rotation
        this.cards.push(card);
        let text = this.add.text(posPlayerinfo[0].name.x, posPlayerinfo[0].name.y, "jean-mis", {
            font: "40px Arial",
            fill: "#0e0b0b",
            align: "center",
            strokeThickness: 8  ,
            stroke: '#24411a',
        })
        text.anchor.setTo(0.5, 0.5);
        //  Apply the shadow to the Stroke only
        text.setShadow(2, 2, '#333333', 2, true, false);
        this.texts.push(text);
    }

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
