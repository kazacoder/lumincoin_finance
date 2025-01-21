import {AuthUtils} from "../../utils/auth-utils";
import {AuthService} from "../../services/auth-service";
import {ValidationUtils} from "../../utils/validation-utils";

export class SignUp {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        if (AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            return this.openNewRoute('/')
        }

        this.findElements();
        this.setValidations();
        document.getElementById("sign-up").addEventListener("click", this.signUp.bind(this));
    }

    findElements() {
        this.emailElement = document.getElementById('email');
        this.nameElement = document.getElementById('name');
        this.lastNameElement = document.getElementById('last-name');
        this.passwordElement = document.getElementById('password');
        this.passwordConfirmElement = document.getElementById('password-confirm');
        this.commonErrorElement = document.getElementById('common-error');
        this.passwordErrorElement = document.getElementById('password-error');
        this.passwordConfirmErrorElement = document.getElementById('password-confirm-error');
    }

    setValidations () {
        this.validations = [
            {element: this.emailElement, options: {pattern: /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/}},
            {element: this.nameElement},
            {element: this.lastNameElement},
            {
                element: this.passwordElement,
                password: true,
                options: {pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{6,}$/},
                errorElement: this.passwordErrorElement,
                wrongPatternText: 'Пароль должен быть не менее 6 символов и содержать цифру, латинскую букву в верхнем и нижнем регистре'
            },
            {
                element: this.passwordConfirmElement,
                confirmPassword: true,
                options: {compareTo: this.passwordElement},
                errorElement: this.passwordConfirmErrorElement,
                wrongPatternText: 'Пароль и подтверждение не совпадают'
            },
        ]
    }

    async signUp() {
        this.commonErrorElement.style.display = 'none';
        if (ValidationUtils.validateForm(this.validations)) {
            const signUpResult = await AuthService.signUp({
                name: this.nameElement.value,
                lastName: this.lastNameElement.value,
                email: this.emailElement.value,
                password: this.passwordElement.value,
                passwordRepeat: this.passwordConfirmElement.value,
            })

            if (signUpResult && signUpResult.user) {
                AuthUtils.setAuthInfo(signUpResult.tokens.accessToken, signUpResult.tokens.refreshToken, {
                    id: signUpResult.user.id,
                    name: signUpResult.user.name,
                    lastName: signUpResult.user.lastName,
                });
                return this.openNewRoute('/?period=today');
            }
            this.commonErrorElement.style.display = 'block';
            if (signUpResult && signUpResult.errorMessage) {
                this.commonErrorElement.innerText = signUpResult.errorMessage;
            }
        }
    }
}




