function login() { // פונקציית התחברות לשרת
    const obj = {
        userName: document.querySelector("#userName").value,
        password: document.querySelector("input[type=password]").value,
    };

    loader(true);

    // שליחה לשרת
    fetch("https://api.shipap.co.il/login", {
        method: 'POST',
        credentials: 'include', // מאפשר שליחה וקבלה של עוגיות
        headers: {
            'Content-Type': 'application/json' // הגדרת סוג התוכן הנשלח לשרת
        },
        body: JSON.stringify(obj), // תוכן הקריאה לשרת
    })
        // קבלה מהשרת
        // *המרת התוכן לפי הצורך*
        .then(res => res.json())
        // התוכן שהתקבל מהשרת (לאחר טיפול של הפונקציה הקודמת)
        .then(data => {
            if (data.status == 'success') {
                setUser(data.user);
                snackbar("המשתמש התחבר בהצלחה");
            } else {
                alert(data.message);
                loader(false);

            }
        });
}
// פונקציה אשר מעלימה את מערכת ההתחברות ומציגה את מערכת ההרשמה
function showRegistration() {
    const loginSection = document.querySelector(".login");
    const registrationSection = document.querySelector(".registration");

    loginSection.style.display = "none";
    registrationSection.style.display = "block";
}
//פונקציה המעבירה את הלקוח ממסך ההרשמה למסך ההתחברות 
function showLogin() {
    const loginSection = document.querySelector(".login");
    const registrationSection = document.querySelector(".registration");

    loginSection.style.display = "block";
    registrationSection.style.display = "none";
}
// פונקציה אשר לוקחת את הפרטים ועושה משתמש חדש
function register() {
    const obj = {
        fullName: document.querySelector("#fullNameReg").value,
        email: document.querySelector("#emailReg").value,
        userName: document.querySelector("#userNameReg").value,
        password: document.querySelector("#passwordReg").value,
    };

    loader(true);

    fetch("https://api.shipap.co.il/signup", {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(obj),
    })
        .then(res => res.json())
        .then(data => {
            if (data.status === 'success') {
                //כאשר ההרשמה הצליחה, עמוד ההתחברות מוצג ועמוד ההרשמה נעלם
                const loginSection = document.querySelector(".login");
                const registrationSection = document.querySelector(".registration");
                loginSection.style.display = "block";
                registrationSection.style.display = "none";
                snackbar("ההרשמה בוצעה בהצלחה, ניתן להתחבר כעת");
            } else {
                alert(data.message);
            }
            loader(false);
        });
}


// פונקציה הרצה בהפעלת האתר ובודקת האם היוזר מחובר
function loginStatus() {
    loader(true);

    fetch("https://api.shipap.co.il/login", {
        credentials: 'include',
    })
        .then(res => res.json())
        .then(data => {
            if (data.status == 'success') {
                setUser(data.user);
                snackbar("המשתמש מחובר");
            } else {
                setUser();
            }

            loader(false);
        });
}
// פונקציה אשר מנתק את המשתמש מהשרת
function logout() {
    loader(true);

    fetch("https://api.shipap.co.il/logout", {
        credentials: 'include',
    })
        .then(() => {
            setUser();
            snackbar("המשתמש התנתק בהצלחה");
            loader(false);
        });
}
//לאחר הוספת המוצר בשרת הפעולה לוקחת את המידע מהשרת ומעבירה את המידע למסך בצורה שהוגדרה לו בכדי שהלקוח יראה את המידע שהתווסף.
function getProducts() {
    loader(true);

    fetch("https://api.shipap.co.il/products", {
        credentials: 'include',
    })
        .then(res => res.json())
        .then(data => {
            document.querySelector(".products").style.display = "block";
            const tbody = document.querySelector(".products tbody");
            tbody.innerHTML = '';

            data.forEach((p, i) => {
                const tr = document.createElement("tr");

                tr.innerHTML = `
            <td>${i + 1}</td>
            <td contenteditable="true" oninput="contentChange(this)" class="name">${p.name}</td>
            <td contenteditable="true" oninput="contentChange(this)" class="price">${p.price}</td>
            <td contenteditable="true" oninput="contentChange(this)" class="discount">${p.discount}</td>
            <td>
                <button class="save" onclick="saveProduct(${p.id}, this)">💾</button>
                <button class="remove" onclick="removeProduct(${p.id}, this)">❌</button>
            </td>
        `;

                tbody.appendChild(tr);
            });

            loader(false);
        });
}
// פונקציה המגדירה את לחצן השמור במצב נראה לעין
function contentChange(tdElem) {
    tdElem.closest('tr').querySelector('.save').style.visibility = 'visible';
}
// פונקציה השומרת את המוצר 
function saveProduct(id, btnElem) {
    const tr = btnElem.closest('tr');

    const obj = {
        name: tr.querySelector('.name').innerText,
        price: tr.querySelector('.price').innerText,
        discount: tr.querySelector('.discount').innerText,
    };

    loader(true);

    fetch(`https://api.shipap.co.il/products/${id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(obj),
    })
        .then(() => {
            tr.querySelector('.save').style.visibility = 'hidden';
            loader(false);
            snackbar("המוצר נשמר בהצלחה");
        });
}
//  פונקציה הלוקחת מהאינפוטים את התוכן והמידע ומכניסה את המוצר לרשימת המוצרים בשרת 
function addProduct() {
    const name = document.querySelector('#name');
    const price = document.querySelector('#price');
    const discount = document.querySelector('#discount');

    const obj = {
        name: name.value,
        price: +price.value,
        discount: +discount.value,
    };

    name.value = '';
    price.value = '';
    discount.value = '';

    loader(true);

    fetch("https://api.shipap.co.il/products", {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(obj),
    })
        .then(res => res.json())
        .then(data => {
            getProducts();
            snackbar("המוצר נוסף בהצלחה");
        });
}
//פונקציה למחיקת המוצר מהשרת
function removeProduct(id, btnElem) {
    if (!confirm('האם אתה בטוח כי ברצונך למחוק את הפריט המדובר?')) { //שואל אם ברצוני למחוק
        return;
    }

    loader(true);

    fetch(`https://api.shipap.co.il/products/${id}`, {
        method: 'DELETE',
        credentials: 'include',
    })
        .then(() => {
            btnElem.closest('tr').remove();
            const trs = document.querySelectorAll('tbody tr');
            trs.forEach((tr, i) => tr.querySelector('td').innerHTML = i + 1);
            loader(false);
            snackbar("המוצר נמחק בהצלחה");
        });
}

// פונקציה האחראית לשים את שם המשתמש בהודעה או לאפשר התחברות
function setUser(user = null) {
    const divLogin = document.querySelector(".login");
    const divUser = document.querySelector(".user");
    const divProduct = document.querySelector(".products");

    // אם יש יוזר, מציגה את שם היוזר ומסתירה את תיבת ההתחברות 
    if (user) {
        divLogin.style.display = 'none';
        divUser.style.display = 'block';
        divUser.querySelector('.userName').innerHTML = `${user.fullName} מחובר!`;
        getProducts();
    } else {
        // אם אין יוזר, מציגה את תיבת ההתחברות
        divLogin.style.display = 'block';
        divUser.style.display = 'none';
        divProduct.style.display = 'none';
        loader(false);
    }
}
// פונקציה המפעילה את העיגול של הטעינה בעת טעינת הפעולה
function loader(isShowing = false) {
    const loaderFrame = document.querySelector('.loaderFrame');

    if (isShowing) {
        loaderFrame.style.display = 'flex';
    } else {
        loaderFrame.style.display = 'none';
    }
}
// פונקציה העוזרת להוסיף הודעה קופצת בעת פעולה
function snackbar(message) {
    const elem = document.getElementById("snackbar");
    elem.innerHTML = message;
    elem.classList.add("show");
    setTimeout(() => elem.classList.remove("show"), 3000);
}