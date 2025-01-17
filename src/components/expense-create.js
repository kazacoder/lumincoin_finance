export class ExpenseCreate {

    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.loadExpenseEdit();
    }

    loadExpenseEdit() {
        const categoryNameElement = document.getElementById("category-name");
        const createButtonElement = document.getElementById("proceed");


        document.querySelector('.main-content__title').innerText = 'Создание категории расходов';
        document.getElementById('cancel').href = '/categories/expense';
        createButtonElement.addEventListener("click", () => {
            categoryNameElement.classList.remove("is-invalid");

            if (!categoryNameElement.value) {
                categoryNameElement.classList.add("is-invalid");
                return;
            }
            this.openNewRoute(`/categories/expense?catName=${categoryNameElement.value}`);
        })
    }
}


