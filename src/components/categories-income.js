export class CategoriesIncome {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.loadCategoriesIncome();
    }
    loadCategoriesIncome() {
        const urlParams = new URLSearchParams(window.location.search);
        const createCategoryElement = document.getElementById("create-category");

        if (urlParams.has('catName')) {
            const newCatElement = document.createElement('div');
            newCatElement.classList.add('card', 'card-category', 'border', 'rounded-3','me-3','mb-3')
            newCatElement.innerHTML = `
                <div class="card-body p-20">
                    <div class="card-title h3 f-weight-500">${urlParams.get('catName')}</div>
                    <div class="actions f-weight-500">
                        <button class="btn btn-primary f-size-14 l-height-24 px-3 edit-button">Редактировать</button>
                        <button type="button" class="btn btn-danger ml-10 f-size-14 l-height-24 px-3 remove-button"
                                data-bs-toggle="modal" data-bs-target="#deleteModal">Удалить
                        </button>
                    </div>
                </div>
    `;
            createCategoryElement.parentNode.insertBefore(newCatElement, createCategoryElement);
        } else if (urlParams.has('changed')) {
            const oldCatName = urlParams.get('oldCatName');
            const categoriesTitleElementArray = [...document.getElementsByClassName('card-title')];
            categoriesTitleElementArray.forEach((el) => {
                if (oldCatName === el.innerText) {
                    el.innerText = urlParams.get('newCatName');
                }
            })
        }

        const editButtonsElementArray = [...document.getElementsByClassName("edit-button")];
        editButtonsElementArray.forEach((btn) => {
            btn.addEventListener("click", () => {
                const catName = btn.parentElement.previousElementSibling.innerText;
                this.openNewRoute(`/categories/income/edit?category=${catName}`);
            })
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
                    btn.parentElement.parentElement.parentElement.remove();
                })
            })
        })
    }
}


