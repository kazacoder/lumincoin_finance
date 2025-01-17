import {HttpUtils} from "../../utils/http-utils";

export class IncomeEdit {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.categoryNameElement = document.getElementById("category-name");
        this.saveButtonElement = document.getElementById("proceed");
        this.getCategory().then();
    }

    async getCategory() {
        const params = new URLSearchParams(location.search)
        const catId = params.get("category");
        const result = await HttpUtils.request(`/categories/income/${catId}`, 'GET')
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
                HttpUtils.request(`/categories/income/${category.id}`, 'PUT', true,
                    {title: this.categoryNameElement.value});
            }
            this.openNewRoute('/categories/income');
        })
    }
}




