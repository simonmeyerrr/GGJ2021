const posPlayerinfo = [
    {
        card: {
            x: 150,
            y: 700,
            rotation: 0.4
        },
        name: {
            x: 100,
            y: 1000,
        }
    },
    {
        card: {
            x: 500,
            y: 800,
            rotation: 0.3
        },
        name: {
            x: 700,
            y: 900,
        }
    },
    {
        card: {
            x: 600,
            y: 840,
            rotation: 0.2
        },
        name: {
            x: 800,
            y: 950,
        }
    },
    {
        card: {
            x: 700,
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
            x: 800,
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
            x: 900,
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
            x: 1000,
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
            x: 1100,
            y: 840,
            rotation: -0.2
        },
        name: {
            x: 1300,
            y: 950,
        }
    },
    {
        card: {
            x: 1200,
            y: 840,
            rotation: -0.3
        },
        name: {
            x: 1430,
            y: 900,
        }
    },
    {
        card: {
            x: 1300,
            y: 840,
            rotation: -0.4
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
    this.load.spritesheet('button', 'public/image/button_sprite_sheet.png', 193, 71);
};

SceneGame.prototype.displayPlayerData = function() {
    const global = this.game.global;
    const players = global.gameClient.players;
    for (let i = 0; i < players.length; i++) {
        if (i === global.gameClient.myPlayerNb) {
            if (!players[i].faceUp) {
                this.cards[i].frame = 54;
            } else {
                let frame = 0;
                frame += players[i].faceUp.value - 1;
                frame += 13 * (players[i].faceUp.color === 'C' ? 0 : players[i].faceUp.color === 'D' ? 1 : players[i].faceUp.color === 'H' ? 2 : 3)
                this.cards[i].frame = frame
            }
            this.texts[i].setText(players[i].username);
        } else if (players[i].connected) {
            if (!players[i].faceUp) {
                this.cards[i].frame = 54;
            } else {
                let frame = 0;
                frame += players[i].faceUp.value - 1;
                frame += 13 * (players[i].faceUp.color === 'C' ? 0 : players[i].faceUp.color === 'D' ? 1 : players[i].faceUp.color === 'H' ? 2 : 3)
                this.cards[i].frame = frame
            }
            this.texts[i].setText(players[i].username);
        } else {
            this.cards[i].frame = 55;
        }
    }
};

SceneGame.prototype.displayGameData = function() {
    const {lastEvent, players, myPlayerNb} = this.game.global.gameClient;
    if (lastEvent.data.player === myPlayerNb) {
        switch (lastEvent.type) {
            case "endTurn":
                console.log("C'est à ton tour d'agir.");
                console.log("Tu peux piocher");
                this.elems.buttonPick.inputEnabled = true;
                this.elems.buttonPick.visible = true;
                if (players[myPlayerNb].drank >= 10) {
                    console.log("Tu peux activer ton pouvoir");
                    this.elems.buttonPower.inputEnabled = true;
                    this.elems.buttonPower.visible = true;
                }
                if (players.reduce((occ, cur) => (cur.connected && !!cur.faceUp ? occ : false), true)) {
                    console.log("Tu peux appeller le Kraken");
                    this.elems.buttonCall.inputEnabled = true;
                    this.elems.buttonCall.visible = true;
                }
                break;
            case "sendPower":
                console.log("Tu as utilisé ton pouvoir.");
                // Choisir qui boit
                console.log("Tu peux piocher");
                this.elems.buttonPick.inputEnabled = true;
                this.elems.buttonPick.visible = true;
                if (players.reduce((occ, cur) => (!!cur.connected && !!cur.faceUp ? occ : false), true)) {
                    console.log("Tu peux appeller le Kraken");
                    this.elems.buttonCall.inputEnabled = true;
                    this.elems.buttonCall.visible = true;
                }
                break;
            case "pick":
                console.log("Tu as pioché une carte.");
                // Choisir qui boit
                this.game.global.gameClient.endTurn();
                break;
            case "callChtulu":
                console.log("Tu as appellé le Kraken.");
                // Choisir qui boit
                this.game.global.gameClient.endTurn();
                break;
        }
    } else {
        console.log("Hide all buttons");
        this.elems.buttonPower.inputEnabled = false;
        this.elems.buttonPower.visible = false;
        this.elems.buttonPick.inputEnabled = false;
        this.elems.buttonPick.visible = false;
        this.elems.buttonCall.inputEnabled = false;
        this.elems.buttonCall.visible = false;
        switch (lastEvent.type) {
            case "endTurn":
                console.log("C'est au tour de " + players[lastEvent.data.player].username);
                break;
            case "sendPower":
                console.log(players[lastEvent.data.player].username + " a utilisé son pouvoir.");
                // Choisir qui boit
                break;
            case "pick":
                console.log(players[lastEvent.data.player].username + " a pioché une carte.");
                // Choisir qui boit
                break;
            case "callChtulu":
                console.log(players[lastEvent.data.player].username + " a appellé le Kraken.");
                // Choisir qui boit
                break;
        }
    }
};

const actionSendPower = function() {
    this.game.global.gameClient.power();
    this.elems.buttonPower.inputEnabled = false;
    this.elems.buttonPower.visible = false;
    this.elems.buttonPick.inputEnabled = false;
    this.elems.buttonPick.visible = false;
    this.elems.buttonCall.inputEnabled = false;
    this.elems.buttonCall.visible = false;
};

const actionPickCard = function() {
    this.game.global.gameClient.pick();
    this.elems.buttonPower.inputEnabled = false;
    this.elems.buttonPower.visible = false;
    this.elems.buttonPick.inputEnabled = false;
    this.elems.buttonPick.visible = false;
    this.elems.buttonCall.inputEnabled = false;
    this.elems.buttonCall.visible = false;
};

const actionCallChtulu = function() {
    this.game.global.gameClient.callChtulu();
    this.elems.buttonPower.inputEnabled = false;
    this.elems.buttonPower.visible = false;
    this.elems.buttonPick.inputEnabled = false;
    this.elems.buttonPick.visible = false;
    this.elems.buttonCall.inputEnabled = false;
    this.elems.buttonCall.visible = false;
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
    this.cards = []
    for (let i = 0; i < 10; ++i) {
        let card = this.add.sprite(posPlayerinfo[i].card.x, posPlayerinfo[i].card.y, "card", 55);
        card.scale.setTo(2.5, 2.5);
        card.rotation = posPlayerinfo[i].card.rotation
        this.cards.push(card);
        let text = this.add.text(posPlayerinfo[i].name.x, posPlayerinfo[i].name.y, "", {
            font: "65px Arial",
            fill: "#0e0b0b",
            align: "center",
            strokeThickness: 16,
            stroke: '#24411a',
        })
        text.anchor.setTo(0.5, 0.5);
        //  Apply the shadow to the Stroke only
        text.setShadow(2, 2, '#333333', 2, true, false);
        this.texts.push(text);
    }
    this.elems = {
        buttonPower: this.add.button(this.world.centerX - 95, 300, 'button', actionSendPower, this, 2, 1, 0),
        buttonPick: this.add.button(this.world.centerX - 95, 500, 'button', actionPickCard, this, 2, 1, 0),
        buttonCall: this.add.button(this.world.centerX - 95, 700, 'button', actionCallChtulu, this, 2, 1, 0),
        errorMessage: this.add.text(0, 0, "", {
            font: "65px ManicSea", fill: "#ff0000",
            boundsAlignH: "center", boundsAlignV: "middle",
        }).setTextBounds(0, 600, 1980, 600),
    };
    this.elems.buttonPower.inputEnabled = false;
    this.elems.buttonPower.visible = false;
    this.elems.buttonPick.inputEnabled = false;
    this.elems.buttonPick.visible = false;
    this.elems.buttonCall.inputEnabled = false;
    this.elems.buttonCall.visible = false;

    // Set callback
    global.gameClient.onPlayerUpdate = () => this.displayPlayerData();
    this.displayPlayerData();
    global.gameClient.onGameUpdate = () => this.displayGameData();
    this.displayGameData();
    global.gameClient.onError = () => this.displayError();
    if (global.gameClient.error) this.displayError();
};
