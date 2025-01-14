export class IncomeEdit {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.loadIncomeEdit();
    }

    loadIncomeEdit() {
        const categoryNameElement = document.getElementById("category-name");
        const saveButtonElement = document.getElementById("save");
        const params = new URLSearchParams(location.search)
        const oldCatName = params.get("category");
        categoryNameElement.value = oldCatName

        saveButtonElement.addEventListener("click", () => {
            categoryNameElement.classList.remove("is-invalid");

            if (!categoryNameElement.value) {
                categoryNameElement.classList.add("is-invalid");
                return;
            }
            if (categoryNameElement.value !== oldCatName) {
                this.openNewRoute(`/categories-income?changed=true&newCatName=${categoryNameElement.value}&oldCatName=${oldCatName}`);
                return;
            }
            this.openNewRoute('/categories-income');
        })
    }
}




