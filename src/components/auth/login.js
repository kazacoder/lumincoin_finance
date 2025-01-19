import {AuthUtils} from "../../utils/auth-utils";
import {AuthService} from "../../services/auth-service";
import {BalanceService} from "../../services/balance-service";

export class Login {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        // if (AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
        //     return this.openNewRoute('/')
        // }

        this.findElements()

        document.getElementById("login").addEventListener("click", this.login.bind(this));

    }

    findElements() {
        this.emailElement = document.getElementById('email');
        this.passwordElement = document.getElementById('password');
        this.rememberMeElement = document.getElementById('remember');
        this.commonErrorElement = document.getElementById('common-error');
    }

    async login() {
        this.commonErrorElement.style.display = 'none';
        if (this.validate()) {
            const  loginResult = await AuthService.logIn({
                email: this.emailElement.value,
                password: this.passwordElement.value,
                rememberMe: this.rememberMeElement.checked,
            })

            if (loginResult && loginResult.user) {
                if (this.rememberMeElement.checked) {
                    AuthUtils.setAuthInfo(loginResult.tokens.accessToken, loginResult.tokens.refreshToken,{
                        id: loginResult.user.id,
                        name: loginResult.user.name,
                        lastName: loginResult.user.lastName,
                    });
                } else {
                    //TODO очистить localStorage, сохранить в sessionStorage
                    AuthUtils.setAuthInfo(loginResult.tokens.accessToken, loginResult.tokens.refreshToken,{
                        id: loginResult.user.id,
                        name: loginResult.user.name,
                        lastName: loginResult.user.lastName,
                    });
                }
                return this.openNewRoute('/')
            }
            this.commonErrorElement.style.display = 'block';
            if (loginResult && loginResult.errorMessage) {
                this.commonErrorElement.innerText = loginResult.errorMessage;
            }
        }

    }

    //TODO перенести в утилиты
    validate() {
        let isValid = true
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
        return isValid;

    }
}

