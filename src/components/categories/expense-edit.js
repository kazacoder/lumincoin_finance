import {HttpUtils} from "../../utils/http-utils";

export class ExpenseEdit {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.categoryNameElement = document.getElementById("category-name");
        this.saveButtonElement = document.getElementById("proceed");
        this.init();
        this.getCategory().then();
    }

    init() {
        document.querySelector('.main-content__title').innerText = 'Редактирование категории расходов';
        document.getElementById('cancel').href = '/categories/expense';
    }

    async getCategory() {
        const params = new URLSearchParams(location.search)
        const catId = params.get("category");
        const result = await HttpUtils.request(`/categories/expense/${catId}`, 'GET')
        this.showCategory(result.response).then();
    }

    async showCategory(category) {
        this.categoryNameElement.value = category.title;

        this.saveButtonElement.addEventListener("click", () => {
            this.categoryNameElement.classList.remove("is-invalid");

            if (!this.categoryNameElement.value) {
                this.categoryNameElement.classList.add("is-invalid");
                return;
            }
            if (this.categoryNameElement.value !== category.title) {
                HttpUtils.request(`/categories/expense/${category.id}`, 'PUT', true,
                    {title: this.categoryNameElement.value});
            }
            this.openNewRoute('/categories/expense');
        })
    }

}




