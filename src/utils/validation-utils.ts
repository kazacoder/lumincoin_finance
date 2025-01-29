import {ValidationsType} from "../components/types/types";

export class ValidationUtils {
    private static validateField(object: ValidationsType): boolean {
        const element = object.element;
        const options = object.options;
        if (!element) { return false; }
        let condition: string | boolean = element.value

        if (options) {
            if (options.hasOwnProperty('pattern')) {
                condition = element.value && !!element.value.match(options.pattern!)
            } else if (options.hasOwnProperty('compareTo')) {
                condition = element.value && element.value === options.compareTo!.value
            } else if (options.hasOwnProperty('checkProperty')) {
                condition = !!options.checkProperty
            } else if (options.hasOwnProperty('checked') && element instanceof HTMLInputElement) {
                condition = element.checked
            }

        }

        if (object.password && element.value && !condition && object.errorElement && object.wrongPatternText) {
            object.errorElement.innerText = object.wrongPatternText
        } else if (object.password && object.errorElement) {object.errorElement.innerText = 'Введите пароль'}

        if (object.confirmPassword && element.value && !condition && object.wrongPatternText && object.errorElement) {
            object.errorElement.innerText = object.wrongPatternText
        } else if (object.confirmPassword && object.errorElement) {
            object.errorElement.innerText = 'Введите подтверждение пароля'
        }

        if (condition) {
            element.classList.remove('is-invalid');
            return true;
        } else {
            element.classList.add('is-invalid');
            return false;
        }
    }

    public static validateForm(validations: ValidationsType[]): boolean {
        let isValid = true

        validations.forEach((el) => {
            if (!ValidationUtils.validateField(el)) {
                isValid = false
            }
        })

        return isValid;
    }
}