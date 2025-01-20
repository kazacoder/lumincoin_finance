import {HttpUtils} from "../../utils/http-utils";

export class CategoriesExpense {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.init();
        this.getCategories().then();
        this.createCategoryElement = document.getElementById("create-category");

    }

    init() {
        document.querySelector('.main-content__title').innerText = 'Расходы';
        document.getElementById('create-category').href = '/categories/expense/create';
    }

    async getCategories() {
        const result = await HttpUtils.request('/categories/expense', 'GET');
        this.showCategories(result.response).then();
    }

    async showCategories(categories) {
        categories.forEach(category => {
            const newCatElement = document.createElement('div');
            newCatElement.classList.add('card', 'card-category', 'border', 'rounded-3', 'me-3', 'mb-3', 'category-item')
            newCatElement.innerHTML = `
                <div class="card-body p-20">
                    <div class="card-title h3 f-weight-500" id="${category.id}">${category.title}</div>
                    <div class="actions f-weight-500">
                        <a href="/categories/expense/edit?category=${category.id}" class="btn btn-primary f-size-14 l-height-24 px-3 edit-button">Редактировать</a>
                        <button type="button" class="btn btn-danger ml-10 f-size-14 l-height-24 px-3 remove-button"
                                data-bs-toggle="modal" data-bs-target="#deleteModal">Удалить
                        </button>
                    </div>
                </div>
            `;
            this.createCategoryElement.parentNode.insertBefore(newCatElement, this.createCategoryElement);
        })

        const modal = new bootstrap.Modal(document.getElementById('deleteModal'), {});
        document.getElementById('delete-modal-title').innerText = 'Вы действительно хотите удалить категорию? Связанные доходы будут удалены навсегда.'
        const removeButtonsElementArray = [...document.getElementsByClassName("remove-button")];

        removeButtonsElementArray.forEach((btn) => {
            btn.addEventListener("click", () => {
                const confirmRemoveButton = document.getElementById('confirm-remove')
                const cloneBtn = confirmRemoveButton.cloneNode(true)
                confirmRemoveButton.parentNode.replaceChild(cloneBtn, confirmRemoveButton);
                cloneBtn.addEventListener('click', () => {
                    modal.hide()
                    const catId = btn.parentElement.previousElementSibling.id
                    HttpUtils.request(`/categories/expense/${catId}`, 'DELETE').then(() => {
                        this.clearCategoriesList()
                        this.getCategories().then();
                    })
                })

            })
        })
    }

    clearCategoriesList() {
        document.querySelectorAll('.category-item').forEach(category => {
            category.remove();
        })
    }
}
