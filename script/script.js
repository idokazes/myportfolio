if (localStorage.contact) {
    const data = JSON.parse(localStorage.contact);

    const contact = document.querySelectorAll('.contact span');

    contact[0].innerHTML = data.name;
    contact[1].innerHTML = data.email;
    contact[2].innerHTML = data.phone;
    contact[3].innerHTML = data.message;
}

function send(ev) {
    ev.preventDefault();

    const form = ev.target;

    const data = {
        name: form.querySelector('[name=name]').value,
        email: form.querySelector('[name=email]').value,
        phone: form.querySelector('[name=phone]').value,
        message: form.querySelector('[name=message]').value,
    }

    localStorage.contact = JSON.stringify(data);
    location.href = 'contact-info.html';
}