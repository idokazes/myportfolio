let input = document.getElementById('inputBox');
let buttons = document.querySelectorAll('button');

let string = "";
let arr = Array.from(buttons);
arr.forEach(button => {
    button.addEventListener('click', (e) => { //בעת לחיצה 
        if (e.target.innerHTML == '=') { // אם הכפתור '=' נלחץ, יתבצע חישוב הביטוי והתוצאה תוצג בתיבת הקלט.
            string = eval(string);
            input.value = string;
        }

        else if (e.target.innerHTML == 'AC') { //לחצן אשר מאפס את האינפוט לריק
            string = "";
            input.value = string;
        }
        else if (e.target.innerHTML == 'DEL') { // לחצן אשר מוחק את התו האחרון ב"מערך" האינפוט
            string = string.substring(0, string.length - 1);
            input.value = string;
        }
        else {
            string += e.target.innerHTML; // כל לחצן שנלחץ מתווסף לאינפוט
            input.value = string;
        }
    })
})