let turn = true; // true = x, false = O
let btnClicked = 0;
let btns = document.querySelectorAll(".btn");
btns.forEach(b => {
    b.addEventListener("click", btnClick);
})
displayTurn();
//פונציה המראה של מי התור מבין השחקנים
function displayTurn() {
    const turnElement = document.querySelector(".turn");
    turnElement.textContent = "Turn of: " + (turn ? "X" : "O");
}
//פונקציה המחליפה את תורות השחקנים ובודקת מצב של ניצחון או תיקו
function btnClick() {
    if (this.textContent != "") return;
    btnClicked++;
    if (turn) this.textContent = "X";
    else this.textContent = "O";
    let obj = checkWin();
    if (obj.win) {
        let btns = document.querySelectorAll(".btn");
        btns[obj.pos[0]].style.color = "red"; //צובעת באדום את המערך המנצח
        btns[obj.pos[1]].style.color = "red";
        btns[obj.pos[2]].style.color = "red";
        setTimeout(() => {
            showWinner(this.textContent + " is winner");
            reset();
            displayTurn();
        }, 100);
    } else if (obj.isTie) {
        setTimeout(() => {
            showWinner(" is A Tie");
            reset();
            displayTurn();
        }, 100);
    }
    turn = !turn;
    displayTurn();
}

// פונקציה אשר מפעילה קונפטי וכותבת בגדול על המסך את הטקסט הניתן כפרמטר
function showWinner(text) {
    const winner = document.createElement("div");
    winner.classList.add("winner");
    winner.innerHTML = text;

    const frame = document.querySelector(".tictactoe");
    frame.appendChild(winner);

    confetti({
        particleCount: 100,
        spread: 70,
        decay: 0.9,
        origin: { y: 0.6 }
    });

    setTimeout(function () {
        frame.removeChild(winner);
    }, 3 * 1000);
}
//פונקציה המאפסת את המשחק 
function reset() {
    turn = !turn;
    btnClicked = 0;
    btns.forEach(b => {
        b.textContent = "";
        b.style.color = "";
    })

}
// פונקציה הבודקת את כל האופציות לנצחון בציר אנכי אופקי או אלכסון
function checkWin() {
    let btns = document.querySelectorAll(".btn");
    let obj = { win: false, isTie: false, pos: [] };

    if (btns[0].textContent == btns[1].textContent && btns[1].textContent == btns[2].textContent && btns[2].textContent != "")
        obj = { win: true, isTie: false, pos: [0, 1, 2] };
    else if (btns[3].textContent == btns[4].textContent && btns[4].textContent == btns[5].textContent && btns[5].textContent != "")
        obj = { win: true, isTie: false, pos: [3, 4, 5] };
    else if (btns[6].textContent == btns[7].textContent && btns[7].textContent == btns[8].textContent && btns[8].textContent != "")
        obj = { win: true, isTie: false, pos: [6, 7, 8] };
    else if (btns[0].textContent == btns[3].textContent && btns[3].textContent == btns[6].textContent && btns[6].textContent != "")
        obj = { win: true, isTie: false, pos: [0, 3, 6] };
    else if (btns[1].textContent == btns[4].textContent && btns[4].textContent == btns[7].textContent && btns[7].textContent != "")
        obj = { win: true, isTie: false, pos: [1, 4, 7] };
    else if (btns[2].textContent == btns[5].textContent && btns[5].textContent == btns[8].textContent && btns[8].textContent != "")
        obj = { win: true, isTie: false, pos: [2, 5, 8] };
    else if (btns[0].textContent == btns[4].textContent && btns[4].textContent == btns[8].textContent && btns[8].textContent != "")
        obj = { win: true, isTie: false, pos: [0, 4, 8] };
    else if (btns[2].textContent == btns[4].textContent && btns[4].textContent == btns[6].textContent && btns[6].textContent != "")
        obj = { win: true, isTie: false, pos: [2, 4, 6] };
    else if (btnClicked == 9) //אם נלחצו 9 לחיצות ועדיין אין מנצח זאת אומרת שזה תיקו 
        obj.isTie = true;

    return obj;

}