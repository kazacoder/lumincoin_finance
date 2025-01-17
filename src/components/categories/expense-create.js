import {HttpUtils} from "../../utils/http-utils";

export class ExpenseCreate {

    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.categoryNameElement = document.getElementById("category-name");
        this.createButtonElement = document.getElementById("proceed");
        this.init();
        this.setCategory().then();
    }

    init() {
        document.querySelector('.main-content__title').innerText = 'Создание категории расходов';
        document.getElementById('cancel').href = '/categories/expense';
        this.createButtonElement.innerText = 'Создать';
    }

    async setCategory() {
        this.createButtonElement.addEventListener("click", (e) => {
            this.categoryNameElement.classList.remove("is-invalid");

            if (!this.categoryNameElement.value) {
                this.categoryNameElement.classList.add("is-invalid");
                return;
            }
            HttpUtils.request('/categories/expense', 'POST', true,
                {title: this.categoryNameElement.value});
            this.openNewRoute('/categories/expense');
        })
    }
}


