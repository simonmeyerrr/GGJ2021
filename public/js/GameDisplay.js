const posPlayerCard = [
    {width: 1560, height: 750, rotate: -0.5},
    {width: 1430, height: 800, rotate: -0.4},
    {width: 1300, height: 840, rotate: -0.3},
    {width: 1200,height: 840, rotate: -0.2},
    {width: 1100, height: 840, rotate: -0.1},
    {width: 1000, height: 840, rotate: 0.0},
    {width: 900, height: 840, rotate: 0.0},
    {width: 800, height: 840, rotate: 0.1},
    {width: 700, height: 840, rotate: 0.2},
    {width: 600, height: 840, rotate: 0.3},
    {width: 500, height: 800, rotate: 0.4},
    {width: 400, height: 750, rotate: 0.5}
];

const posBigCard = {
    width: 1920 / 2 - 220,
    height: 1080 / 2 - 280,
};

const posStartCards = {
    width: 1920 / 2 - 100,
    height: 1080 / 2 + 50,
};

const gameOptions = {
    scaleBaseCard: 0.6,
    // flipping speed in milliseconds
    flipSpeed: 600,
    flipMoveSpeed: 1200,
    // flipping zoom ratio. Simulates the card to be raised when flipping
    flipZoom: 1.2
};

class Card {
    constructor(x, y, card) {
        this.y = y;
        this.x = x;
        this.isFlipping = false;
        this.firsClick = true;
        this.isMoving = false;
        this.card = card;

        this.flipTween = game.add.tween(this.card.scale).to({
            x: 0,
            y: gameOptions.flipZoom
        }, gameOptions.flipSpeed / 2, Phaser.Easing.Linear.None);

        // once the card is flipped, we change its frame and call the second tween
        this.flipTween.onComplete.add(function () {
            this.card.frame = 1 - this.card.frame;
            this.backFlipTween.start();
        }, this);

        // second tween: we complete the flip and lower the card
        this.backFlipTween = game.add.tween(this.card.scale).to({
            x: 2,
            y: 2
        }, gameOptions.flipSpeed / 2, Phaser.Easing.Linear.None);
    }

    setScale(x, y) {
        console.log("yo");
        this.card.scale.setTo(x, y);
    }

    setSlowScaling(x, y) {
        this.slowScaling = game.add.tween(this.card.scale).to({
            x: x,
            y: y
        }, gameOptions.flipSpeed / 2, Phaser.Easing.Linear.None);
        this.slowScaling.start();
    }

    flipCard() {
        this.flipTween.start();
    }

    moveTo(x, y) {
        this.flipMove = game.add.tween(this.card).to({
            x: x,
            y: y
        }, gameOptions.flipMoveSpeed / 2, Phaser.Easing.Linear.None);
        this.flipMove.onComplete.add(function () {
            this.isMoving = false;
        }, this);
        this.flipMove.start();
    }

    setRotate(degre) {
        this.rotateMove = game.add.tween(this.card).to({
            rotation: degre,
        }, gameOptions.flipMoveSpeed / 2, Phaser.Easing.Linear.None);
        this.rotateMove.onComplete.add(function () {
            this.isMoving = false;
        }, this);
        this.rotateMove.start();
    }
}

const config = {
    type: Phaser.AUTO,
    width: 1920,
    height: 1080,
};

let game;

function startDisplay() {

    game = new Phaser.Game(config);

    // game states
    game.state.add("PlayGame", playGame);
    game.state.start("PlayGame");
}

let player = 0;


let playGame = function (game) {
}
playGame.prototype = {
    preload: () => {

        // making the game cover the biggest window area possible while showing all content
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;

        // changing background colors
        game.stage.backgroundColor = 0x448844;

        // card sprite sheet
        game.load.spritesheet("card", "public/image/cards.png", 167, 243);
        game.load.spritesheet("background", "public/image/background.jpg", {frameWidth: 1920, frameHeight: 1080});
        game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');

    },

    create: () => {
        this.background = game.add.sprite(0, 0, "background", 0);
        game.add.image(660, 412, 'lulu');

        var text1 = game.add.text(20, 50, "Shadow Stroke", {font: "74px Arial Black", fill: "#c51b7d"});
        text1.stroke = "#de77ae";
        text1.strokeThickness = 16;
        //  Apply the shadow to the Stroke only
        text1.setShadow(2, 2, "#333333", 2, true, false);

        this.cards = [];
        for (let i = 0; i < 52; ++i) {
            let card = game.add.sprite(posStartCards.width, posStartCards.height, "card", 0);
            this.cards.push(new Card(posStartCards.width, posStartCards.height, card));
        }
        this.cards.forEach(element => element.setScale(gameOptions.scaleBaseCard, gameOptions.scaleBaseCard))
        this.cards = this.cards.reverse()
        game.input.onDown.add(function () {

            if (!this.cards.length) {
                return;
            }
            let head = this.cards[0];
            if (!head.isFlipping && head.firsClick) {

                // it's flipping now!
                head.isFlipping = true;
                head.firsClick = false;
                head.isMoving = true


                // start the first of the two flipping animations
                head.flipCard();
                head.moveTo(posBigCard.width, posBigCard.height);
            } else if (!head.isMoving) {
                head.moveTo(posPlayerCard[player].width, posPlayerCard[player].height);
                head.setSlowScaling(gameOptions.scaleBaseCard, gameOptions.scaleBaseCard);
                head.setRotate(posPlayerCard[player].rotate);
                this.cards.shift()
                ++player;
                if (player === 12) {
                    player = 0;
                }
            }
        }, this);

    }

};
