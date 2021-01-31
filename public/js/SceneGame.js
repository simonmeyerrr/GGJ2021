const posPlayerinfo = [
    {
        card: {
            x: 345,
            y: 685,
            rotation: 0.27
        },
        name: {
            x: 100,
            y: 1020,
        },
        skin: {
            x: 100,
            y: 875
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
            y: 875
        }
    },
    {
        card: {
            x: 615,
            y: 755,
            rotation: 0.1
        },
        name: {
            x: 450,
            y: 1020,
        },
        skin: {
            x: 450,
            y: 875
        }
    },
    {
        card: {
            x: 750,
            y: 770,
            rotation: 0.05
        },
        name: {
            x: 625,
            y: 1020,
        },
        skin: {
            x: 625,
            y: 875
        }
    },
    {
        card: {
            x: 885,
            y: 780,
            rotation: 0.0
        },
        name: {
            x: 800,
            y: 1020,
        },
        skin: {
            x: 800,
            y: 875
        }
    },
    {
        card: {
            x: 1020,
            y: 780,
            rotation: 0.0
        },
        name: {
            x: 975,
            y: 1020,
        },
        skin: {
            x: 975,
            y: 875
        }
    },
    {
        card: {
            x: 1155,
            y: 775,
            rotation: -0.05
        },
        name: {
            x: 1150,
            y: 1020,
        },
        skin: {
            x: 1150,
            y: 875
        }
    },
    {
        card: {
            x: 1290,
            y: 760,
            rotation: -0.1
        },
        name: {
            x: 1325,
            y: 1020,
        },
        skin: {
            x: 1325,
            y: 875
        }
    },
    {
        card: {
            x: 1425,
            y: 735,
            rotation: -0.2
        },
        name: {
            x: 1500,
            y: 1020,
        },
        skin: {
            x: 1500,
            y: 875
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
            y: 875
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
    constructor(card) {
        this.isFlipping = false;
        this.isMoving = false;
        this.card = card;
        this.reset();
    }

    reset(x, y) {
        this.isFlipping = false;
        this.isMoving = false;
        this.card.rotation = 0;
        this.card.x = drawDeck.x;
        this.card.y = drawDeck.y;
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

    flipCard(frame, game, x, y, rotate, cd) {
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
                this.moveTo(x, y, game, cd);
                this.setSlowScaling(1, 1, game);
                this.setRotate(rotate, game);
                this.isFlipping = false;

            });
        });
        this.flipTween.start();
    }

    moveTo(x, y, game, cb) {
        this.flipMove = game.add.tween(this.card).to({
            x: x,
            y: y
        }, gameOptions.flipMoveSpeed / 2, Phaser.Easing.Linear.None);
        this.flipMove.onComplete.add(function(){
            this.isMoving = false;
            if (cb) cb();
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

    animate(game, card, player, cb) {
        let frame = 0;
        frame += card.value - 1;
        frame += 13 * (card.color === 'C' ? 0 : card.color === 'D' ? 1 : card.color === 'H' ? 2 : 3);
        this.reset();

        this.flipCard(frame, game, posPlayerinfo[player].card.x, posPlayerinfo[player].card.y, posPlayerinfo[player].card.rotation, cb);
        this.moveTo(game.game.world.width / 2 -  120, game.game.world.height / 2 - 300, game);
    }
};

const SceneGame = function() {};

SceneGame.prototype.preload = function() {
    console.log("Preload Scene Game");
    const global = this.game.global;
    // Load assets
    this.load.spritesheet("card", "public/image/cards.png", 81, 117);
    this.load.spritesheet("skin", "public/image/avatars.png", 500, 500);
    this.load.spritesheet("background", "public/image/background.png", {frameWidth: 1920, frameHeight: 1080});
    this.load.spritesheet("cut", "public/image/barre.png", {frameWidth: 202, frameHeight: 440});
    this.load.spritesheet("perroquet", "public/image/3_perroques.png", 239, 196);
    this.load.spritesheet("bulle", "public/image/bulle_game.png", 1920, 350);
    this.load.spritesheet('button', 'public/image/button_sprite_sheet.png', 193, 71);

};

SceneGame.prototype.displayPlayerData = function() {
    const global = this.game.global;
    const players = global.gameClient.players;
    for (let i = 0; i < players.length; i++) {
        if (i === global.gameClient.myPlayerNb) {
            if (!players[i].faceUp) {
                this.elems.cards[i].frame = 52;
            } else {
                let frame = 0;
                frame += players[i].faceUp.value - 1;
                frame += 13 * (players[i].faceUp.color === 'C' ? 0 : players[i].faceUp.color === 'D' ? 1 : players[i].faceUp.color === 'H' ? 2 : 3)
                this.elems.cards[i].frame = frame
            }
            for (let index = 0; index < skinsOrder.length; ++index) {
                if (skinsOrder[index] === players[i].race) {
                    this.elems.skins[i].frame = index;
                }
            }
            this.elems.skins[i].visible = true;
            this.elems.cards[i].visible = true;
            this.elems.texts[i].visible = true;
            this.elems.texts[i].setText(players[i].username);
            this.elems.texts[i].fill = '#ffa900'
        } else if (players[i].connected) {
            if (!players[i].faceUp) {
                this.elems.cards[i].frame = 52;
            } else {
                let frame = 0;
                frame += players[i].faceUp.value - 1;
                frame += 13 * (players[i].faceUp.color === 'C' ? 0 : players[i].faceUp.color === 'D' ? 1 : players[i].faceUp.color === 'H' ? 2 : 3)
                this.elems.cards[i].frame = frame
            }
            this.elems.texts[i].setText(players[i].username);
            for (let index = 0; index < skinsOrder.length; ++index) {
                if (skinsOrder[index] === players[i].race) {
                    this.elems.skins[i].frame = index;
                }
            }
            this.elems.skins[i].visible = true;
            this.elems.cards[i].visible = true;
            this.elems.texts[i].visible = true;
        } else {
            this.elems.skins[i].visible = false;
            this.elems.cards[i].visible = false;
            this.elems.texts[i].visible = false;
            this.elems.cards[i].frame = 52;
        }
    }
};

SceneGame.prototype.displayGameData = function() {
    const {lastEvent, players, myPlayerNb} = this.game.global.gameClient;
    if (lastEvent.data.player === myPlayerNb) {
        switch (lastEvent.type) {
            case "endTurn":
                console.log("C'est à ton tour"); // TODO perroquet dit ca
                this.elems.buttonPick.inputEnabled = true;
                this.elems.buttonPick.visible = true;
                if (players[myPlayerNb].drank >= 10) {
                    this.elems.buttonPower.inputEnabled = true;
                    this.elems.buttonPower.visible = true;
                }
                if (players.reduce((occ, cur) => (cur.connected && !!cur.faceUp ? occ : false), true)) {
                    this.elems.buttonCall.inputEnabled = true;
                    this.elems.buttonCall.visible = true;
                }
                break;
            case "sendPower":
                console.log("Tu as utilisé ton pouvoir."); // TODO perroquet dit ca
                // potentiellement animation en lien avec
                console.log("Afficher gages liés au pouvoir"); // TODO mais relou
                this.elems.buttonPick.inputEnabled = true;
                this.elems.buttonPick.visible = true;
                if (players.reduce((occ, cur) => (!!cur.connected && !!cur.faceUp ? occ : false), true)) {
                    this.elems.buttonCall.inputEnabled = true;
                    this.elems.buttonCall.visible = true;
                }
                break;
            case "pick":
                console.log("Tu as pioché une carte."); // TODO perroquet dit ca
                this.elems.mainCardObj.animate(this, lastEvent.data.card, lastEvent.data.player, () => {
                    console.log("afficher qui boit quoi"); // TODO relou
                    // for (const drink of lastEvent.data.drinks) {} drink -> {player: 0, drink: 2}
                    this.elems.buttonEnd.inputEnabled = true;
                    this.elems.buttonEnd.visible = true;
                });
                break;
            case "callChtulu":
                console.log("Tu as appellé le Kraken."); // TODO perroquet dit ca
                // Potentielement animation kraken en meme temps
                this.elems.mainCardObj.animate(this, lastEvent.data.card, lastEvent.data.player, () => {
                    console.log("afficher qui boit quoi"); // TODO relou
                    // if (lastEvent.data.total >= lastEvent.data.needed) tout le monde cul sec sauf toi else tu bois cul sec
                    this.elems.buttonEnd.inputEnabled = true;
                    this.elems.buttonEnd.visible = true;
                });
                break;
        }
    } else {
        this.hideAllActions();
        switch (lastEvent.type) {
            case "endTurn":
                console.log("C'est au tour de " + players[lastEvent.data.player].username); // TODO perroquet dit ca
                break;
            case "sendPower":
                console.log(players[lastEvent.data.player].username + " a utilisé son pouvoir."); // TODO perroquet dit ca
                // potentielement animation en lien avec
                console.log("Afficher gages liés au pouvoir"); // TODO mais relou
                break;
            case "pick":
                console.log(players[lastEvent.data.player].username + " a pioché une carte."); // TODO perroquet dit ca
                this.elems.mainCardObj.animate(this, lastEvent.data.card, lastEvent.data.player, () => {
                    console.log("afficher qui boit quoi"); // TODO relou
                    // for (const drink of lastEvent.data.drinks) {} drink -> {player: 0, drink: 2}
                });
                break;
            case "callChtulu":
                console.log(players[lastEvent.data.player].username + " a appellé le Kraken.");
                // Potentielement animation kraken en meme temps
                this.elems.mainCardObj.animate(this, lastEvent.data.card, lastEvent.data.player, () => {
                    console.log("afficher qui boit quoi"); // TODO relou
                    // if (lastEvent.data.total >= lastEvent.data.needed) tout le monde cul sec sauf toi else tu bois cul sec
                });
                break;
        }
    }
};

const actionSendPower = function() {
    this.hideAllActions();
    this.game.global.gameClient.power();
};

const actionPickCard = function() {
    this.hideAllActions();
    this.game.global.gameClient.pick();
};

const actionCallChtulu = function() {
    this.hideAllActions();
    this.game.global.gameClient.callChtulu();
};

const actionEndTurn = function() {
    this.hideAllActions();
    this.game.global.gameClient.endTurn();
};

SceneGame.prototype.hideAllActions = function() {
    this.elems.buttonPower.inputEnabled = false;
    this.elems.buttonPower.visible = false;
    this.elems.buttonPick.inputEnabled = false;
    this.elems.buttonPick.visible = false;
    this.elems.buttonCall.inputEnabled = false;
    this.elems.buttonCall.visible = false;
    this.elems.buttonEnd.inputEnabled = false;
    this.elems.buttonEnd.visible = false;
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

    this.elems = {
        background: this.add.sprite(0, 0, "background", 0),
        returnedCard: this.add.sprite(drawDeck.x, drawDeck.y, "card", 52),
        texts: [],
        cards: [],
        skins: [],
    };

    this.bulle = this.add.sprite(0, 0, "bulle", 0);
    this.bulle.animations.add("talk");
    this.bulle.animations.play("talk", 10, true);
    this.add.sprite(36, 38, "cut");
    this.perroquet = this.add.sprite(45, 38, "perroquet");
    this.perroquet.animations.add("breathe", [0, 1]);
    this.perroquet.animations.play("breathe", 2, true);


    for (let i = 0; i < 10; ++i) {
        const card = this.add.sprite(posPlayerinfo[i].card.x, posPlayerinfo[i].card.y, "card", 52);
        card.rotation = posPlayerinfo[i].card.rotation;
        this.elems.cards.push(card);
        const skin = this.add.sprite(posPlayerinfo[i].skin.x, posPlayerinfo[i].skin.y, "skin", 0);
        skin.scale.setTo(0.35, 0.35);
        this.elems.skins.push(skin);
        const text = this.add.text(0, 0, "", {
            font: "40px ManicSea",
            fill: "#ffffff",
            textAlign: "center",
            boundsAlignH: "center"
        }).setTextBounds(posPlayerinfo[i].name.x, posPlayerinfo[i].name.y, 200, posPlayerinfo[i].name.y);
        this.elems.texts.push(text);
        skin.visible = false;
        card.visible = false;
        text.visible = false;
    }

    this.elems = {...this.elems,
        mainCard: this.add.sprite(drawDeck.x, drawDeck.y, "card", 52),
        buttonPower: this.add.button(this.world.centerX - 95, 300, 'button', actionSendPower, this, 2, 1, 0),
        buttonPick: this.add.button(this.world.centerX - 95, 500, 'button', actionPickCard, this, 2, 1, 0),
        buttonCall: this.add.button(this.world.centerX - 95, 700, 'button', actionCallChtulu, this, 2, 1, 0),
        buttonEnd: this.add.button(this.world.centerX - 95, 600, 'button', actionEndTurn, this, 2, 1, 0),
        errorMessage: this.add.text(0, 0, "", {
            font: "65px ManicSea", fill: "#ff0000",
            boundsAlignH: "center", boundsAlignV: "middle",
        }).setTextBounds(0, 600, 1980, 600),
    };
    this.hideAllActions();

    this.elems.mainCardObj = new Card(this.elems.mainCard);

    // Set callback
    global.gameClient.onPlayerUpdate = () => this.displayPlayerData();
    this.displayPlayerData();
    global.gameClient.onGameUpdate = () => this.displayGameData();
    this.displayGameData();
    global.gameClient.onError = () => this.displayError();
    if (global.gameClient.error) this.displayError();
};
