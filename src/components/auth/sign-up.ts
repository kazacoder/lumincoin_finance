import {AuthUtils} from "../../utils/auth-utils";
import {AuthService} from "../../services/auth-service";
import {ValidationUtils} from "../../utils/validation-utils";
import {OpenNewRouteInterface} from "../types/interfaces";
import {CommonErrorType, LoginResponseType, ValidationsType} from "../types/types";

export class SignUp {
    readonly openNewRoute: OpenNewRouteInterface;
    private emailElement: HTMLInputElement | null = null;
    private nameElement: HTMLInputElement | null = null;
    private lastNameElement: HTMLInputElement | null = null;
    private passwordElement: HTMLInputElement | null = null;
    private passwordConfirmElement: HTMLInputElement | null = null;
    private commonErrorElement: HTMLElement | null = null;
    private passwordErrorElement: HTMLInputElement | null = null;
    private passwordConfirmErrorElement: HTMLInputElement | null = null;
    private validations: ValidationsType[] | [] = [];

    constructor(openNewRoute: OpenNewRouteInterface) {
        this.openNewRoute = openNewRoute;
        if (AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            this.openNewRoute('/').then();
            return;
        }
        this.findElements();
        this.setValidations();
        const signUpButtonElement = document.getElementById("sign-up");
        if (signUpButtonElement) {
            signUpButtonElement.addEventListener("click", this.signUp.bind(this));
        }
    }

    private findElements(): void {
        this.emailElement = document.getElementById('email') as HTMLInputElement;
        this.nameElement = document.getElementById('name') as HTMLInputElement;
        this.lastNameElement = document.getElementById('last-name') as HTMLInputElement;
        this.passwordElement = document.getElementById('password') as HTMLInputElement;
        this.passwordConfirmElement = document.getElementById('password-confirm') as HTMLInputElement;
        this.commonErrorElement = document.getElementById('common-error');
        this.passwordErrorElement = document.getElementById('password-error') as HTMLInputElement;
        this.passwordConfirmErrorElement = document.getElementById('password-confirm-error') as HTMLInputElement;
    }

    private setValidations(): void {
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
                options: {compareTo: this.passwordElement!},
                errorElement: this.passwordConfirmErrorElement,
                wrongPatternText: 'Пароль и подтверждение не совпадают'
            },
        ]
    }

    private async signUp(): Promise<void> {
        this.commonErrorElement ? this.commonErrorElement.style.display = 'none' : null;
        if (ValidationUtils.validateForm(this.validations)) {
            let signUpResult = await AuthService.signUp({
                name: this.nameElement!.value,
                lastName: this.lastNameElement!.value,
                email: this.emailElement!.value,
                password: this.passwordElement!.value,
                passwordRepeat: this.passwordConfirmElement!.value,
            })

            if (signUpResult && signUpResult.hasOwnProperty('user')) {
                signUpResult = signUpResult as LoginResponseType;
                AuthUtils.setAuthInfo(signUpResult.tokens.accessToken, signUpResult.tokens.refreshToken, {
                    id: signUpResult.user.id,
                    name: signUpResult.user.name,
                    lastName: signUpResult.user.lastName,
                });
                return this.openNewRoute('/?period=today');
            }

            this.commonErrorElement ? this.commonErrorElement.style.display = 'block': null;
            if (signUpResult && signUpResult.hasOwnProperty('errorMessage') && this.commonErrorElement) {
                this.commonErrorElement.innerText = (signUpResult as CommonErrorType).errorMessage;
            }
        }
    }
}
