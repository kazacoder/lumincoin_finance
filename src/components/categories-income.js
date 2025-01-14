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
                location.href = `../templates/pages/categories/income-edit.html`;
            })
        })

        const modal = new bootstrap.Modal(document.getElementById('deleteModal'), {});
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

// <!-- Modal -->
// <div class="modal fade" id="deleteModal" data-bs-keyboard="false" tabindex="-1" aria-labelledby="deleteModalLabel"
//      aria-hidden="true">
//     <div class="modal-dialog modal-dialog-centered">
//         <div class="modal-content py-40 text-center rounded-4 ">
//             <div class="modal-body f-weight-500 h5 color-violet p-0 mb-20">
//                 Вы действительно хотите удалить категорию? Связанные расходы будут удалены навсегда.
//             </div>
//             <div class="px-3 ">
//                 <button type="button" class="btn btn-success f-size-14 f-weight-500 mx-2" id="confirm-remove">Да, удалить</button>
//                 <button type="button" class="btn btn-danger f-size-14 f-weight-500" data-bs-dismiss="modal">Не удалять
//                 </button>
//             </div>
//         </div>
//     </div>
// </div>


