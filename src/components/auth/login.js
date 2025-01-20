import {AuthUtils} from "../../utils/auth-utils";
import {AuthService} from "../../services/auth-service";
import {ValidationUtils} from "../../utils/validation-utils";

export class Login {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.findElements()
        this.validations = [
            {element: this.passwordElement},
            {element: this.emailElement, options: {pattern: /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/}},
        ]
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
        if (ValidationUtils.validateForm(this.validations)) {
            const loginResult = await AuthService.logIn({
                email: this.emailElement.value,
                password: this.passwordElement.value,
                rememberMe: this.rememberMeElement.checked,
            })

            if (loginResult && loginResult.user) {
                AuthUtils.setAuthInfo(loginResult.tokens.accessToken, loginResult.tokens.refreshToken, {
                    id: loginResult.user.id,
                    name: loginResult.user.name,
                    lastName: loginResult.user.lastName,
                });

                return this.openNewRoute('/')
            }
            this.commonErrorElement.style.display = 'block';
            if (loginResult && loginResult.errorMessage) {
                this.commonErrorElement.innerText = loginResult.errorMessage;
            }
        }

    }
}

