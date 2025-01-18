import {HttpUtils} from "../../utils/http-utils";

export class OperationCreate {
    constructor(openNewRoute) {
        this.categorySelectElement = null;
        this.typeSelectElement = null;
        this.openNewRoute = openNewRoute;
        this.init().then();
    }

    async getCategories(type) {
        const result = await HttpUtils.request('/categories/' + type, 'GET');
        return result.response;
    }

    async init() {
        const type = (new URLSearchParams(window.location.search)).get('type');

        console.log(document.referrer);

        this.categorySelectElement = document.getElementById("category");
        this.typeSelectElement = document.getElementById('type');
        this.createButton = document.getElementById('proceed');
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
        this.setInitialType(type);

        this.typeSelectElement.addEventListener('change', (e) => {
            document.querySelectorAll('.added-option-category').forEach(item => {
                item.remove();
            });
            this.loadCategoryList(e.target.value);
        });
        if (this.typeSelectElement.value) {
            await this.loadCategoryList(this.typeSelectElement.value)
        }

        this.createButton.addEventListener('click', (e) => {
            e.preventDefault();

            if (!this.validate()) {
                HttpUtils.request('/operations', 'POST', true, {
                    type: this.typeSelectElement.value,
                    category_id: parseInt(this.categorySelectElement.value),
                    amount: parseInt(this.amountInputElement.value),
                    date: new Date(this.dateInputElement.value).toISOString().slice(0, 10),
                    comment: this.commentaryInputElement.value,
                })
                this.openNewRoute('/balance?period=today')
            }
        })

        this.cancelButton.href = '/balance?period=today'
    }

    async loadCategoryList(category) {
        if (['income', 'expense'].includes(category)) {
            const categories = await this.getCategories(category);
            categories.forEach(category => {
                const optionElement = document.createElement('option');
                optionElement.value = category.id;
                optionElement.innerText = category.title;
                optionElement.classList.add('added-option-category');
                this.categorySelectElement.appendChild(optionElement);
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





