import {HttpUtils} from "../../utils/http-utils";
import {ValidationUtils} from "../../utils/validation-utils";

class Operation {
    constructor(openNewRoute) {
        this.categorySelectElement = null;
        this.typeSelectElement = null;
        this.period = 'today';
        this.openNewRoute = openNewRoute;
        this.categoryObject = {}
        this.init().then();
    }

    async init() {
        this.findElements();
        this.setValidations();
        this.setTypeSelectElementEventListener().then();
        this.params = new URLSearchParams(window.location.search);
        if (this.params.get('period')) {
            this.period = this.params.get('period');
        }
        this.cancelButton.href = `/balance?period=${this.period}`;
        this.dateInputElement.value = new Date().toISOString().slice(0, 10);
    }

    async getCategories(type) {
        const result = await HttpUtils.request('/categories/' + type, 'GET');
        return result.response;
    }
    findElements() {
        this.categorySelectElement = document.getElementById("category");
        this.typeSelectElement = document.getElementById('type');
        this.proceedButton = document.getElementById('proceed');
        this.cancelButton = document.getElementById('cancel');
        this.amountInputElement = document.getElementById('amount');
        this.dateInputElement = document.getElementById('date');
        this.commentaryInputElement = document.getElementById('commentary');
    }

    setValidations () {
        this.validations = [
            {element: this.categorySelectElement},
            {element: this.typeSelectElement},
            {element: this.amountInputElement},
            {element: this.dateInputElement},
        ]
    }

    async loadCategoryList(category, safeToObject = false) {
        if (['income', 'expense'].includes(category)) {
            const categories = await this.getCategories(category);
            categories.forEach(category => {
                const optionElement = document.createElement('option');
                optionElement.value = category.id;
                optionElement.innerText = category.title;
                optionElement.classList.add('added-option-category');
                this.categorySelectElement.appendChild(optionElement);
                if (safeToObject) {
                    this.categoryObject[category.title] = category.id;
                }
            });
        }
    }

    async setTypeSelectElementEventListener() {
        this.typeSelectElement.addEventListener('change', (e) => {
            document.querySelectorAll('.added-option-category').forEach(item => {
                item.remove();
            });
            this.loadCategoryList(e.target.value);
            this.categorySelectElement.value = '';
        });
    }

    setInitialType(type) {
        this.typeOptionsObject = {}
        for (let el of this.typeSelectElement.children) {
            if (el.value) {
                this.typeOptionsObject[el.value] = el;
            }
        }
        if (this.typeOptionsObject[type]) {
            this.typeOptionsObject[type].setAttribute('selected', '');
        }
    }
}

export class OperationCreate extends Operation {

    async init() {
        super.init().then();
        const type = (new URLSearchParams(window.location.search)).get('type');
        this.setInitialType(type);

        if (this.typeSelectElement.value) {
            await this.loadCategoryList(this.typeSelectElement.value)
        }

        this.proceedButton.addEventListener('click', (e) => {
            e.preventDefault();
            if (ValidationUtils.validateForm(this.validations)) {
                HttpUtils.request('/operations', 'POST', true, {
                    type: this.typeSelectElement.value,
                    category_id: parseInt(this.categorySelectElement.value),
                    amount: parseInt(this.amountInputElement.value),
                    date: new Date(this.dateInputElement.value).toISOString().slice(0, 10),
                    comment: this.commentaryInputElement.value ? this.commentaryInputElement.value : ' ',
                })
                this.openNewRoute(`/balance?period=${this.period}`)
            }
        })
    }
}

export class OperationEdit extends Operation {
    async init() {
        super.init().then();
        document.querySelector('.main-content__title').innerText = 'Редактирование дохода/расхода';
        this.proceedButton.innerText = 'Сохранить'
        const operationId = this.params.get('operationId');
        await this.loadCurrentOperation(operationId);

        this.proceedButton.addEventListener('click', (e) => {
            e.preventDefault();
            if (ValidationUtils.validateForm(this.validations)) {
                const changedOperation = {}
                changedOperation.type = this.typeSelectElement.value;
                changedOperation.category_id = parseInt(this.categorySelectElement.value);
                changedOperation.amount = parseInt(this.amountInputElement.value);
                changedOperation.date = new Date(this.dateInputElement.value).toISOString().slice(0, 10);
                changedOperation.comment = this.commentaryInputElement.value ? this.commentaryInputElement.value : ' ';
                const hasChanged = Object.keys(changedOperation).map(key => {
                    return changedOperation[key] !== this.curretnOperation[key]
                }).some(Boolean);
                if (hasChanged) {
                    HttpUtils.request(`/operations/${operationId}`, 'PUT', true, changedOperation)
                }
                this.openNewRoute(`/balance?period=${this.period}`)
            }
        })
        this.cancelButton.href = `/balance?period=${this.period}`
    }

    async loadCurrentOperation(id) {
        const result = await HttpUtils.request(`/operations/${id}`, 'GET');

        if (result.response && !result.response.error) {
            this.curretnOperation = result.response;
            this.setInitialType(this.curretnOperation.type);
            if (this.typeSelectElement.value) {
                await this.loadCategoryList(this.typeSelectElement.value, true)
            }
            this.curretnOperation.category_id = this.categoryObject[this.curretnOperation.category]
            this.categorySelectElement.value = this.categoryObject[this.curretnOperation.category]
            this.amountInputElement.value = this.curretnOperation.amount;
            this.dateInputElement.value = new Date(this.curretnOperation.date.split('.').reverse().join('-')).toISOString().slice(0, 10);
            this.commentaryInputElement.value = this.curretnOperation.comment;
        }
    }
}