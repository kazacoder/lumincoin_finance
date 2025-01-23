import {AuthUtils} from "../../utils/auth-utils";
import {AuthService} from "../../services/auth-service";
import {ValidationUtils} from "../../utils/validation-utils";

export class Login {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.findElements();
        this.setValidations();
        document.getElementById("login").addEventListener("click", this.login.bind(this));
    }

    findElements() {
        this.emailElement = document.getElementById('email');
        this.passwordElement = document.getElementById('password');
        this.rememberMeElement = document.getElementById('remember');
        this.commonErrorElement = document.getElementById('common-error');
        this.passwordErrorElement = document.getElementById('password-error');
    }

    setValidations () {
        this.validations = [
            {
                element: this.passwordElement,
                password: true,
                options: {pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{6,}$/},
                errorElement: this.passwordErrorElement,
                wrongPatternText: 'Пароль должен быть не менее 6 символов и содержать цифру, латинскую букву в верхнем и нижнем регистре'
            },
            {element: this.emailElement, options: {pattern: /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/}},
        ]
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

