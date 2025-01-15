export class IncomeCreate {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.loadIncomeCreate();
    }

    loadIncomeCreate() {
        const categoryNameElement = document.getElementById("category-name");
        const createButtonElement = document.getElementById("proceed");

        document.querySelector('.main-content__title').innerText = 'Создание категории доходов';
        createButtonElement.innerText = 'Создать';
        createButtonElement.addEventListener("click", (e) => {
            categoryNameElement.classList.remove("is-invalid");

            if (!categoryNameElement.value) {
                categoryNameElement.classList.add("is-invalid");
                return;
            }
            this.openNewRoute(`/categories/income?catName=${categoryNameElement.value}`);
        })
    }
}


