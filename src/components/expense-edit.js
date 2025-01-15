export class ExpenseEdit {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.loadExpenseEdit();
    }

    loadExpenseEdit() {
        const categoryNameElement = document.getElementById("category-name");
        const saveButtonElement = document.getElementById("proceed");
        const params = new URLSearchParams(location.search)
        const oldCatName = params.get("category");
        categoryNameElement.value = oldCatName

        document.querySelector('.main-content__title').innerText = 'Редактирование категории расходов';
        document.getElementById('cancel').href = '/categories/expense';
        saveButtonElement.addEventListener("click", () => {
            categoryNameElement.classList.remove("is-invalid");

            if (!categoryNameElement.value) {
                categoryNameElement.classList.add("is-invalid");
                return;
            }
            if (categoryNameElement.value !== oldCatName) {
                this.openNewRoute(`/categories/expense?changed=true&newCatName=${categoryNameElement.value}&oldCatName=${oldCatName}`);
                return;
            }
            this.openNewRoute('/categories/expense');
        })
    }
}




