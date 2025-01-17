import {AuthUtils} from "../../utils/auth-utils";
import {AuthService} from "../../services/auth-service";
import {BalanceService} from "../../services/balance-service";

export class SignUp {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        if (AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            return this.openNewRoute('/')
        }

        this.findElements()

        document.getElementById("sign-up").addEventListener("click", this.signUp.bind(this));
    }

    findElements() {
        this.emailElement = document.getElementById('email');
        this.nameElement = document.getElementById('name');
        this.lastNameElement = document.getElementById('last-name');
        this.passwordElement = document.getElementById('password');
        this.passwordConfirmElement = document.getElementById('password-confirm');
        this.commonErrorElement = document.getElementById('common-error');
        this.passwordConfirmErrorElement = document.getElementById('password-confirm-error');
    }


    validate() {
        let isValid = true

        if (this.nameElement.value) {
            this.nameElement.classList.remove('is-invalid');
        } else {
            this.nameElement.classList.add('is-invalid');
            isValid = false;
        }

        if (this.lastNameElement.value) {
            this.lastNameElement.classList.remove('is-invalid');
        } else {
            this.lastNameElement.classList.add('is-invalid');
            isValid = false;
        }

        if (this.emailElement.value && this.emailElement.value.match(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/)) {
            this.emailElement.classList.remove('is-invalid');
        } else {
            this.emailElement.classList.add('is-invalid');
            isValid = false;
        }

        if (this.passwordElement.value) {
            this.passwordElement.classList.remove('is-invalid');
        } else {
            this.passwordElement.classList.add('is-invalid');
            isValid = false;
        }

        if (!this.passwordConfirmElement.value) {
            this.passwordConfirmElement.classList.add('is-invalid');
            this.passwordConfirmErrorElement.innerText = 'Введите подтверждение пароля';
            isValid = false;
        } else if (this.passwordConfirmElement.value !== this.passwordElement.value) {
            this.passwordConfirmElement.classList.add('is-invalid');
            this.passwordConfirmErrorElement.innerText = 'Пароль и подтверждение не совпадают';
            isValid = false;
        } else {
            this.passwordConfirmElement.classList.remove('is-invalid');
        }

        return isValid;
    }

    async signUp() {
        this.commonErrorElement.style.display = 'none';
        if (this.validate()) {
            const signUpResult = await AuthService.signUp({
                name: this.nameElement.value,
                lastName: this.lastNameElement.value,
                email: this.emailElement.value,
                password: this.passwordElement.value,
                passwordRepeat: this.passwordConfirmElement.value,
            })

            if (signUpResult && signUpResult.user) {
                //TODO очистить localStorage, сохранить в sessionStorage
                AuthUtils.setAuthInfo(signUpResult.tokens.accessToken, signUpResult.tokens.refreshToken, {
                    id: signUpResult.user.id,
                    name: signUpResult.user.name,
                    lastName: signUpResult.user.lastName,
                });
                await BalanceService.saveBalanceToStorage()
                return this.openNewRoute('/');
            }
            this.commonErrorElement.style.display = 'block';
            if (signUpResult && signUpResult.errorMessage) {
                this.commonErrorElement.innerText = signUpResult.errorMessage;
            }
        }

    }
}




