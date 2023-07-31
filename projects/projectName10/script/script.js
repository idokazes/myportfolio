class AudioController { // קלאס המנהל את הצלילים והווליום של הצלילים של המשחק
    constructor() {
        this.bgMusic = new Audio('/projects/projectName10/images/start.mp3');
        this.flipSound = new Audio('/projects/projectName10/images/flip.wav');
        this.matchSound = new Audio('/projects/projectName10/images/match.wav');
        this.victorySound = new Audio('/projects/projectName10/images/victory.wav');
        this.gameOverSound = new Audio('/projects/projectName10/images/gameOver.wav');
        this.bgMusic.volume = 0.5;
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


class MixOrMatch { // קלאס של MixOrMatch מתאם ומנהל את זרימת המשחק, כולל תיחום הזמן והגבלת הזמן למשחק.
    constructor(totalTime, cards) {
        this.cardsArray = cards;
        this.totalTime = totalTime;
        this.timeRemaining = totalTime;
        this.timer = document.getElementById('time')
        this.ticker = document.getElementById('flips');
        this.audioController = new AudioController();
    }
    // פונקציה אשר מתחילה את המשחק. מאפסת את הספירה, מערבבת את הכרטיסים, הופכת את הכרטיסים ומאפסת את מספר ההפיכות
    startGame() {
        this.totalClicks = 0;
        this.timeRemaining = this.totalTime;
        this.cardToCheck = null;
        this.matchedCards = [];
        this.busy = true;
        setTimeout(() => {
            this.audioController.startMusic();
            this.shuffleCards(this.cardsArray);
            this.countdown = this.startCountdown();
            this.busy = false;
        }, 500)
        this.hideCards();
        this.timer.innerText = this.timeRemaining;
        this.ticker.innerText = this.totalClicks;
    }
    startCountdown() { // פונקציה אשר מפעילה את הספירה לאחור וכאשר מגיעה ל-0 השחקן מפסיד
        return setInterval(() => {
            this.timeRemaining--;
            this.timer.innerText = this.timeRemaining;
            if (this.timeRemaining === 0)
                this.gameOver();
        }, 1000);
    }
    gameOver() { // פונקציה המפעילה את הצליל של ההפסד עם מסך של הפסד ואפשרות התחלה מחדש
        clearInterval(this.countdown);
        this.audioController.gameOver();
        document.getElementById('game-over-text').classList.add('visible');
    }
    victory() { // פונקציה המפעילה את הצליל של הנצחון עם מסך של נצחון ואפשרות התחלה מחדש
        clearInterval(this.countdown);
        this.audioController.victory();
        document.getElementById('victory-text').classList.add('visible');
    }
    hideCards() { //פונקציה אשר הופכת מחדש את כל הכרטיסים 
        this.cardsArray.forEach(card => {
            card.classList.remove('visible');
            card.classList.remove('matched');
        });
    }
    flipCard(card) { // הפונקציה תבצע הפיכת כרטיס עם הסאונד והוספת הקלאס אשר משאיר אותו גלוי 
        if (this.canFlipCard(card)) {
            this.audioController.flip();
            this.totalClicks++;
            this.ticker.innerText = this.totalClicks;
            card.classList.add('visible');

            if (this.cardToCheck) { //בודקת אם הכרטיס תואם לכרטיס ההפוך מראש 
                this.checkForCardMatch(card);
            } else {
                this.cardToCheck = card;
            }
        }
    }
    //פונקציה הבודקת אם התוכן של הכרטיסים שווה אם כן מפעילה את הפונקציה של הכרטיסים תואמים ואם לא, מפעילה את הפונקציה של הלא תואמים.
    checkForCardMatch(card) {
        if (this.getCardType(card) === this.getCardType(this.cardToCheck))
            this.cardMatch(card, this.cardToCheck);
        else
            this.cardMismatch(card, this.cardToCheck);

        this.cardToCheck = null;
    }
    cardMatch(card1, card2) { //כאשר 2 הכרטיסים זהים הם מקבלים קלאס matched 
        this.matchedCards.push(card1);
        this.matchedCards.push(card2);
        card1.classList.add('matched');
        card2.classList.add('matched');
        this.audioController.match();
        if (this.matchedCards.length === this.cardsArray.length) //כאשר כל הכרטיסים נמצאים במערך הכרטיסים הזהיםמדובר בניצחון והפונקציה מפעילה את פונקצית הנצחון.
            this.victory();
    }
    cardMismatch(card1, card2) { // כאשר הקלפים לא זהים הקלפים חוזרים להיות הפוכים ונמשך המשחק
        this.busy = true;
        setTimeout(() => {
            card1.classList.remove('visible');
            card2.classList.remove('visible');
            this.busy = false;
        }, 1000);
    }
    shuffleCards(cardsArray) { // פונקציה המערבבת את מקומי הכרטיסים כל משחק מחדש
        for (let i = cardsArray.length - 1; i > 0; i--) {
            let randIndex = Math.floor(Math.random() * (i + 1));
            cardsArray[randIndex].style.order = i;
            cardsArray[i].style.order = randIndex;
        }
    }
    getCardType(card) { //מקבלת את תוכן הכרטיס
        return card.getElementsByClassName('card-value')[0].src;
    }
    canFlipCard(card) { //אם הכרטיס בעל אפשרות להתהפך הפונקציה מחזירה true
        return !this.busy && !this.matchedCards.includes(card) && card !== this.cardToCheck;
    }
}

if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready);
} else {
    ready();
}

function ready() { // פונקציה הנתטענת בפתיחת המשחק ומכינה את המשחק להיות "מוכן".
    let overlays = Array.from(document.getElementsByClassName('overlay-text'));
    let cards = Array.from(document.getElementsByClassName('card'));
    let game = new MixOrMatch(100, cards);

    overlays.forEach(overlay => {
        overlay.addEventListener('click', () => {
            overlay.classList.remove('visible');
            game.startGame();
        });
    });

    cards.forEach(card => {
        card.addEventListener('click', () => {
            game.flipCard(card);
        });
    });
}