export class ValidationUtils {
    static validateField(object) {
        const element = object.element;
        const options = object.options;
        let condition = element.value

        if (options) {
            if (options.hasOwnProperty('pattern')) {
                condition = element.value && element.value.match(options.pattern)
            } else if (options.hasOwnProperty('compareTo')) {
                condition = element.value && element.value === options.compareTo.value
            } else if (options.hasOwnProperty('checkProperty')) {
                condition = !!options.checkProperty
            } else if (options.hasOwnProperty('checked')) {
                condition = element.checked
            }

        }

        if (object.password && element.value && !condition) {
            object.errorElement.innerText = object.wrongPatternText
        } else if (object.password) {object.errorElement.innerText = 'Введите пароль'}

        if (object.confirmPassword && element.value && !condition) {
            object.errorElement.innerText = object.wrongPatternText
        } else if (object.confirmPassword) {object.errorElement.innerText = 'Введите подтверждение пароля'}

        if (condition) {
            element.classList.remove('is-invalid');
            return true;
        } else {
            element.classList.add('is-invalid');
            return false;
        }
    }

    static validateForm(validations) {
        let isValid = true

        validations.forEach((el) => {
            if (!ValidationUtils.validateField(el)) {
                isValid = false
            }
        })

        return isValid;
    }
}