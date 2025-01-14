export class SignUp {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.loadTemp()
    }
    loadTemp() {

        const signUpButton = document.getElementById("sign-up");
        const nameElement =document.getElementById("name");
        const emailElement =document.getElementById("email");
        const passwordElement =document.getElementById("password");
        const passwordConfirmElement =document.getElementById("password-confirm");
        const passwordConfirmErrorElement =document.getElementById("password-confirm-error");


        signUpButton.addEventListener("click", (e) => {
            e.preventDefault();
            let isValid = true

            if (nameElement.value) {
                nameElement.classList.remove('is-invalid');
            } else {
                nameElement.classList.add('is-invalid');
                isValid = false;
            }

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

            if (!passwordConfirmElement.value) {
                passwordConfirmElement.classList.add('is-invalid');
                passwordConfirmErrorElement.innerText = 'Введите подтверждение пароля';
                isValid = false;
            }
            else if (passwordConfirmElement.value !== passwordElement.value) {
                passwordConfirmElement.classList.add('is-invalid');
                passwordConfirmErrorElement.innerText = 'Пароль и подтверждение не совпадают';
                isValid = false;
            } else {
                passwordConfirmElement.classList.remove('is-invalid');
            }


            if (isValid) {
                this.openNewRoute('/');
            }
        })
    }
}




