const height = 40;
const width = 30;
const length = 10;
const snake = new Array(length).fill(null).map((n, i) => i);
snake.reverse();
let head = snake[0];
let direction = 'left';
let isGameOver = false;
let random;
let interval;
let score = 0;

const rightBoundaries = [];
const leftBoundaries = [];

// גבולות ימין
for (let i = 0; i < height; i++) {
    rightBoundaries.push(width * i - 1);
}

// גבולות שמאל
for (let i = 1; i <= height; i++) {
    leftBoundaries.push(width * i);
}

const board = document.querySelector(".board");
board.style.gridTemplateColumns = `repeat(${width}, 1fr)`;
// יצירת לוח המשחק והגדרת הגבולות השמאליים והימניים.
function createBoard() {
    for (let i = 0; i < height * width; i++) {
        const div = document.createElement('div');
        board.appendChild(div);
    }

    color();
    setApple();
}
// הצגת הודעה אשר תוצג בפופ-אפ על המסך בעת הפסד
function showPopup(message) {
    const popup = document.getElementById('popup');
    const popupMessage = document.getElementById('popup-message');
    const popupClose = document.getElementById('popup-close');

    popupMessage.innerText = message;
    popup.style.display = 'flex';


    popupClose.addEventListener('click', () => {
        popup.style.display = 'none';
        location.reload();
    });
}
//פונקציה אשר בודקת את הכיוון והפניות של הנחש וצובעת אותו בהתאם בעזרת הוספת קלאסים
function color() {
    const divs = document.querySelectorAll('.board div');


    divs.forEach(elem => {
        elem.classList.remove('active');
        elem.classList.remove('head');
        elem.classList.remove('up');
        elem.classList.remove('right');
        elem.classList.remove('down');
        elem.classList.remove('left');
        elem.classList.remove('topLeftRadius');
        elem.classList.remove('topRightRadius');
        elem.classList.remove('bottomRightRadius');
        elem.classList.remove('bottomLeftRadius');
    });


    snake.forEach((num, i) => {
        divs[num].classList.add('active');
        const prev = snake[i + 1];
        const next = snake[i - 1];

        if (prev && next) {
            if ((next == num - 1 && prev == num + width) || (next == num + width && prev == num - 1)) {
                divs[num].classList.add('topLeftRadius');
            } else if ((next == num + width && prev == num + 1) || (prev == num + width && next == num + 1)) {
                divs[num].classList.add('topRightRadius');
            } else if ((next == num + 1 && prev == num - width) || (prev == num + 1 && next == num - width)) {
                divs[num].classList.add('bottomRightRadius');
            } else if ((next == num - 1 && prev == num - width) || (prev == num - 1 && next == num - width)) {
                divs[num].classList.add('bottomLeftRadius');
            }
        }
    });

    divs[head].classList.add('head');
    divs[head].classList.add(direction);
    document.getElementById('score').innerText = score;
}
//פונקציה אשר בודקת את הכיוונים הפונטנציאלים שאליהם הנחש יכול לפנות
function move(dir) {
    if (isGameOver) {
        return;
    }

    const divs = document.querySelectorAll('.board div');

    if (dir === 'up') {
        if (direction === 'down') {
            return;
        }

        head -= width;

        if (!divs[head]) {
            gameOver();
            return;
        }
    } else if (dir === 'down') {
        if (direction === 'up') {
            return;
        }

        head += width;

        if (!divs[head]) {
            gameOver();
            return;
        }
    } else if (dir === 'left') {
        if (direction === 'right') {
            return;
        }

        head++;

        if (leftBoundaries.includes(head)) {
            gameOver();
            return;
        }
    } else if (dir === 'right') {
        if (direction === 'left') {
            return;
        }

        head--;

        if (rightBoundaries.includes(head)) {
            gameOver();
            return;
        }
    }

    if (snake.includes(head)) {
        gameOver();
        return;
    }

    direction = dir;
    snake.unshift(head);

    if (head === random) {
        const audio = document.createElement('audio');
        audio.src = "/projects/projectName11/images/Pebble.ogg";
        audio.play();
        setApple();
        score++;
    } else {
        snake.pop();
    }

    color();
    startAuto();
}

function gameOver() { //פונקציה אשר מפעילה צליל של הפסד מאפסת את הטיימר ומאפסת את המשחק
    isGameOver = true;
    clearInterval(interval);
    stopTimer();
    const audio = document.createElement('audio');
    audio.src = "/projects/projectName11/images/retrogameover.wav";
    audio.play();


    setTimeout(() => { // מפעילה את הפופ אפ של ההפסד
        showPopup("GAME OVER");
    }, 2000);
    showPopup("GAME OVER");
}

function setApple() { //פונקציה המוסיפה ללוח תפוח במקום רנדומלי
    const divs = document.querySelectorAll('.board div');
    random = Math.floor(Math.random() * divs.length);

    if (snake.includes(random)) {
        setApple();
    } else {
        divs.forEach(elem => elem.classList.remove('apple'));
        divs[random].classList.add('apple');
    }
}
function startAuto() {
    clearInterval(interval);
    interval = setInterval(() => move(direction), 200);
}
// הגדרת כיווני התנועה על ידי לחצני המקלדת
window.addEventListener('keydown', ev => {
    ev.preventDefault();

    switch (ev.key) {
        case 'ArrowUp': move('up'); break;
        case 'ArrowRight': move('right'); break;
        case 'ArrowDown': move('down'); break;
        case 'ArrowLeft': move('left'); break;
        case 'Escape': clearInterval(interval); break;
    }
});

let isFirstMove = false;
let timeElapsed = 0;
let timerInterval;

function startTimer() { // פונקציה היוצרת את הטיימר ומקדמת את השניות והדקות
    timerInterval = setInterval(() => {
        timeElapsed++;
        const minutes = Math.floor(timeElapsed / 60);
        const seconds = timeElapsed % 60;


        document.getElementById('time').innerText = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }, 1000);
}
function stopTimer() { //מאפסת את הטיימר
    clearInterval(timerInterval);
}
// כאשר הלחצן הראשון נעשה הטיימר מתחיל לעבוד
function handleFirstMove(event) {
    if (!isFirstMove) {
        isFirstMove = true;
        startTimer();
    }

    document.removeEventListener('keydown', handleFirstMove);
}


document.addEventListener('keydown', handleFirstMove);