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

const gameOptions = {

    // flipping speed in milliseconds
    flipSpeed: 600,
    flipMoveSpeed: 1200,

    // flipping zoom ratio. Simulates the card to be raised when flipping
    flipZoom: 1.2
}

const skinsOrder = ["gobelin", "orc", "siren", "mage", "elf", "nain"]

const drawDeck = {
    x: 1920 / 2,
    y: 1080 / 2 + 70
}

const Card = class {
    constructor(x, y, card) {
        this.y = y;
        this.x = x;
        this.isFlipping = false;
        this.isMoving = false;
        this.card = card;
    }

    reset(x, y) {
        this.isFlipping = false;
        this.isMoving = false;
        this.card.rotation = 0;
        this.card.x = x;
        this.card.y = y;
        this.card.scale.setTo(1, 1);
        this.card.frame = 52;
    }

    setScale(x, y) {
        this.card.scale.setTo(x, y);
    }

    setSlowScaling(x, y, game) {
        this.slowScaling = game.add.tween(this.card.scale).to({
            x: x,
            y: y
        }, gameOptions.flipSpeed / 2, Phaser.Easing.Linear.None);
        this.slowScaling.start();
    }

    flipCard(frame, game, x, y, rotate) {
        this.frame = frame
        this.flipTween = game.add.tween(this.card.scale).to({
            x: 0,
            y: gameOptions.flipZoom
        }, gameOptions.flipSpeed / 2, Phaser.Easing.Linear.None);

        // once the card is flipped, we change its frame and call the second tween
        this.flipTween.onComplete.add(function(){
            this.card.frame = frame;
            this.backFlipTween.start();
        }, this);

        // second tween: we complete the flip and lower the card
        this.backFlipTween = game.add.tween(this.card.scale).to({
            x: 4,
            y: 4
        }, gameOptions.flipSpeed / 2, Phaser.Easing.Linear.None);
        this.backFlipTween.onComplete.add(() => {
            game.time.events.add(2000, () => {
                this.moveTo(x, y, game);
                this.setSlowScaling(1, 1, game);
                this.setRotate(rotate, game);
                this.isFlipping = false;

            });
        });
        this.flipTween.start();
    }

    moveTo(x, y, game) {
        this.flipMove = game.add.tween(this.card).to({
            x: x,
            y: y
        }, gameOptions.flipMoveSpeed / 2, Phaser.Easing.Linear.None);
        this.flipMove.onComplete.add(function(){
            this.isMoving = false;
        }, this);
        this.flipMove.start();
    }

    setRotate(degre, game) {
        this.rotateMove = game.add.tween(this.card).to({
            rotation: degre,
        }, gameOptions.flipMoveSpeed / 2, Phaser.Easing.Linear.None);
        this.rotateMove.onComplete.add(function(){
            this.isMoving = false;
        }, this);
        this.rotateMove.start();
    }
}

const SceneGame = function() {};

SceneGame.prototype.preload = function() {
    console.log("Preload Scene Game");
    const global = this.game.global;
    // Load assets
    this.load.spritesheet("card", "public/image/cards.png", 81, 117);
    this.load.spritesheet("skin", "public/image/avatars.png", 500, 500);
    this.load.spritesheet("background", "public/image/background.png", {frameWidth: 1920, frameHeight: 1080});
    this.load.spritesheet('button', 'public/image/button_sprite_sheet.png', 193, 71);
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
            for (let index = 0; index < skinsOrder.length; ++index) {
                if (skinsOrder[index] === players[i].race) {
                    this.skins[i].frame = index;
                }
            }
            this.skins[i].visible = true;
            this.cards[i].visible = true;
            this.texts[i].visible = true;
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
            for (let index = 0; index < skinsOrder.length; ++index) {
                if (skinsOrder[index] === players[i].race) {
                    this.skins[i].frame = index;
                }
            }
            this.skins[i].visible = true;
            this.cards[i].visible = true;
            this.texts[i].visible = true;
        } else {
            this.skins[i].visible = false;
            this.cards[i].visible = false;
            this.texts[i].visible = false;
            this.cards[i].frame = 52;
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
    this.add.sprite(drawDeck.x, drawDeck.y, "card", 52);
    let mainCard = this.add.sprite(drawDeck.x, drawDeck.y, "card", 52);
    this.mainCard = new Card(drawDeck.x, drawDeck.y, mainCard);


    this.texts = [];
    this.cards = [];
    this.skins = [];
    for (let i = 0; i < 10; ++i) {
        let skin = this.add.sprite(posPlayerinfo[i].skin.x, posPlayerinfo[i].skin.y, "skin", 0);
        skin.scale.setTo(0.40, 0.40);
        this.skins.push(skin);
        let card = this.add.sprite(posPlayerinfo[i].card.x, posPlayerinfo[i].card.y, "card", 52);
        card.rotation = posPlayerinfo[i].card.rotation
        this.cards.push(card);
        let text = this.add.text(0, 0, "", {
            font: "40px ManicSea",
            fill: "#0e0b0b",
            textAlign: "center",
            boundsAlignH: "center"
            }).setTextBounds(posPlayerinfo[i].name.x, posPlayerinfo[i].name.y, 200, posPlayerinfo[i].name.y);
        this.texts.push(text);
        skin.visible = false;
        card.visible = false;
        text.visible = false;
    }
    this.game.input.onDown.add(() => {

        if (!this.mainCard.isFlipping && !this.mainCard.isMoving) {

            // it's flipping now!
            this.mainCard.isFlipping = true;
            this.mainCard.isMoving = true


            // start the first of the two flipping animations
            this.world.bringToTop(this.mainCard.card);
            this.mainCard.flipCard(1, this, posPlayerinfo[0].card.x, posPlayerinfo[0].card.y, posPlayerinfo[0].card.rotation);
            this.mainCard.moveTo(this.game.world.width / 2 -  120, this.game.world.height / 2 - 300, this);
        }
    });
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
