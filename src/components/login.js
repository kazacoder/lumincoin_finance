const loginButton = document.getElementById("login");

const emailElement =document.getElementById("email");
const passwordElement =document.getElementById("password");


loginButton.addEventListener("click", (e) => {
    e.preventDefault();
    let isValid = true
    if (emailElement.value && emailElement.value.match(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/)) {
        emailElement.classList.remove('is-invalid');
    } else {
        emailElement.classList.add('is-invalid');
        isValid = false;
    }
    if (passwordElement.value) {
        passwordElement.classList.remove('is-invalid');
    } else {
        passwordElement.classList.add('is-invalid');
        isValid = false;
    }
    if (isValid) {
        location.href="../../index.html";
    }
})