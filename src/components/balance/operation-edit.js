import {HttpUtils} from "../../utils/http-utils";

export class OperationEdit {
    constructor(openNewRoute) {
        this.categorySelectElement = null;
        this.typeSelectElement = null;
        this.period = 'today';
        this.openNewRoute = openNewRoute;
        this.init().then();
    }

    async getCategories(type) {
        const result = await HttpUtils.request('/categories/' + type, 'GET');
        return result.response;
    }

    async loadCurrentOperation(id) {
        const result = await HttpUtils.request(`/operations/${id}`, 'GET');

        if (result.response && !result.response.error) {
            this.curretnOperation = result.response;
            this.setInitialType(this.curretnOperation.type);
            if (this.typeSelectElement.value) {
                await this.loadCategoryList(this.typeSelectElement.value)
            }
            this.curretnOperation.category_id = this.categoryObject[this.curretnOperation.category]
            this.categorySelectElement.value = this.categoryObject[this.curretnOperation.category]
            this.amountInputElement.value = this.curretnOperation.amount;
            this.dateInputElement.value = new Date(this.curretnOperation.date.split('.').reverse().join('-')).toISOString().slice(0, 10);
            this.commentaryInputElement.value = this.curretnOperation.comment;
        }
        console.log(result.response);

    }

    async init() {
        this.categorySelectElement = document.getElementById("category");
        this.typeSelectElement = document.getElementById('type');
        this.saveButton = document.getElementById('proceed');
        this.cancelButton = document.getElementById('cancel');
        this.amountInputElement = document.getElementById('amount');
        this.dateInputElement = document.getElementById('date');
        this.commentaryInputElement = document.getElementById('commentary');

        this.typeOptionsObject = {}
        for (let el of this.typeSelectElement.children) {
            if (el.value) {
                this.typeOptionsObject[el.value] = el;
            }
        }

        document.querySelector('.main-content__title').innerText = 'Редактирование дохода/расхода';

        this.saveButton.innerText = 'Сохранить'

        this.typeSelectElement.addEventListener('change', (e) => {
            document.querySelectorAll('.added-option-category').forEach(item => {
                item.remove();
            });
            this.loadCategoryList(e.target.value);
            this.categorySelectElement.value = '';
        });


        const params = new URLSearchParams(window.location.search);
        const operationId = params.get('operationId');
        if (params.get('period')) {
            this.period = params.get('period');
        }
        await this.loadCurrentOperation(operationId);

        this.saveButton.addEventListener('click', (e) => {
            e.preventDefault();

            if (!this.validate()) {
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

    async loadCategoryList(category) {
        this.categoryObject = {}
        if (['income', 'expense'].includes(category)) {
            const categories = await this.getCategories(category);
            categories.forEach(category => {
                const optionElement = document.createElement('option');
                optionElement.value = category.id;
                optionElement.innerText = category.title;
                optionElement.classList.add('added-option-category');
                this.categorySelectElement.appendChild(optionElement);
                this.categoryObject[category.title] = category.id;
            });
        }

    }

    setInitialType(type) {
        if (this.typeOptionsObject[type]) {
            this.typeOptionsObject[type].setAttribute('selected', '');
        }
    }

    validate() {
        let hasError = false;

        if (!this.typeSelectElement.value) {
            this.typeSelectElement.classList.add('is-invalid');
            hasError = true;
        } else {
            this.typeSelectElement.classList.remove('is-invalid');
        }

        if (!this.categorySelectElement.value) {
            this.categorySelectElement.classList.add('is-invalid');
            hasError = true;
        } else {
            this.categorySelectElement.classList.remove('is-invalid');
        }

        if (!this.amountInputElement.value && !this.dateInputElement.value.match(/^\d+$/)) {
            this.amountInputElement.classList.add('is-invalid');
            hasError = true;
        } else {
            this.amountInputElement.classList.remove('is-invalid');
        }

        if (!this.dateInputElement.value) {
            this.dateInputElement.classList.add('is-invalid');
            hasError = true;
        } else {
            this.dateInputElement.classList.remove('is-invalid');
        }

        return hasError
    }
}