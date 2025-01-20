import {HttpUtils} from "../../utils/http-utils";
import {ValidationUtils} from "../../utils/validation-utils";

export class OperationCreate {
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
        this.validations = [
            {element: this.categorySelectElement},
            {element: this.typeSelectElement},
            {element: this.amountInputElement},
            {element: this.dateInputElement},
        ]

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
            this.categorySelectElement.value = '';
        });
        if (this.typeSelectElement.value) {
            await this.loadCategoryList(this.typeSelectElement.value)
        }

        const params = new URLSearchParams(window.location.search);
        if (params.get('period')) {
            this.period = params.get('period');
        }

        this.createButton.addEventListener('click', (e) => {
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

        this.cancelButton.href = `/balance?period=${this.period}`
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
}
