class AudioController {
    constructor() {
        this.bgMusic = new Audio('assets/song/uclsong.mp3');
        this.flipSound = new Audio('assets/song/flip.mp3');
        this.matchSound = new Audio('assets/song/match.wav');
        this.victorySound = new Audio('assets/song/applause.wav');
        this.gameOverSound = new Audio('assets/song/boo.wav');
        this.bgMusic.volume = 0.5;
        this.gameOverSound.volume = 0.5;
        this.bgMusic.loop = true;
    }
    startMusic() {
        this.bgMusic.play();
    }
    stopMusic() {
        this.bgMusic.pause();
        this.bgMusic.currentTime = 0;
    }
    flip() {
        this.flipSound.play();
    }
    match() {
        this.matchSound.play();
    }
    victory() {
        this.stopMusic();
        this.victorySound.play();
    }
    gameOver() {
        this.stopMusic();
        this.gameOverSound.play();
    }
}

class gamePlay {
    constructor(totalTime, cards) {
        this.cards = cards;
        this.totalTime = totalTime;
        this.timeRemaining = totalTime;
        this.timer = document.querySelector('#time');
        this.counterFlip = document.querySelector('#flips');
        this.audioController = new AudioController();
    }
    startGame() {
        this.cardToFlip = null;
        this.totalCounterFlip = 0;
        this.timeRemaining = this.totalTime;
        this.matchesCard = [];
        this.busy = true;

        setTimeout(() => {
            this.audioController.startMusic();
            this.shuffleCards();
            this.countDown = this.startCountDown();
            this.busy = false;
        }, 500);
        this.hideCards();
        this.timer.innerText = this.timeRemaining;
        this.counterFlip.innerText = this.totalCounterFlip;
    }
    hideCards() {
        this.cards.forEach((card) => {
            card.classList.remove('visible');
            card.classList.remove('matched');
        });
    }
    flipCard(card) {
        console.log(this.canFlipCard(card));
        if (this.canFlipCard(card)) {
            this.audioController.flip();
            this.totalCounterFlip++;
            this.counterFlip.innerText = this.totalCounterFlip;
            card.classList.add('visible');

            if (this.cardToFlip) {
                this.checkMatch(card);
            } else {
                this.cardToFlip = card;
            }
        }
    }
    checkMatch(card) {
        if (this.getCardType(card) === this.getCardType(this.cardToFlip)) {
            this.cardMatch(card, this.cardToFlip);
        } else {
            this.cardNotMatch(card, this.cardToFlip);
        }
        this.cardToFlip = null;
    }
    cardMatch(card1, card2) {
        this.matchesCard.push(card1);
        this.matchesCard.push(card2);
        card1.classList.add('matched');
        card2.classList.add('matched');
        this.audioController.match();
        if (this.matchesCard.length === this.cards.length) {
            this.victory();
        }
    }
    cardNotMatch(card1, card2) {
        this.busy = true;
        setTimeout(() => {
            card1.classList.remove('visible');
            card2.classList.remove('visible');
            this.busy = false;
        }, 1000);
    }
    getCardType(card) {
        return card.querySelector('.value').src;
    }
    shuffleCards() {
        for (let i = this.cards.length - 1; i > 0; i--) {
            let randomPos = Math.floor(Math.random() * (i + 1));
            this.cards[randomPos].style.order = i;
            this.cards[i].style.order = randomPos;
        }
    }
    canFlipCard(card) {
        // return true;
        return (!this.busy && !this.matchesCard.includes(card) && card !== this.cardToFlip);
    }
    startCountDown() {
        return setInterval(() => {
            this.timeRemaining--;
            this.timer.innerText = this.timeRemaining;
            if (this.timeRemaining === 0) {
                this.gameOver();
            }
        }, 1000);
    }
    gameOver() {
        clearInterval(this.countDown);
        this.audioController.gameOver();
        document.querySelector('#gameover').classList.add('visible');
    }
    victory() {
        clearInterval(this.countDown);
        this.audioController.victory();
        document.querySelector('#victory').classList.add('visible');
    }
}

function ready() {
    let overlays = document.querySelectorAll('.overlay-text');
    let cards = document.querySelectorAll('.card');
    let game = new gamePlay(100, cards);

    overlays.forEach((overlay) => {
        overlay.addEventListener('click', () => {
            overlay.classList.remove('visible');
            game.startGame();
        });
    });

    cards.forEach((card) => {
        card.addEventListener('click', () => {
            game.flipCard(card);
        });
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ready());
} else {
    ready();
}