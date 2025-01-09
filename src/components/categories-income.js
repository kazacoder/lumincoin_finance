const urlParams = new URLSearchParams(window.location.search);
const createCategoryElement = document.getElementById("create-category");
const editButtonsElementArray = [...document.getElementsByClassName("edit-button")];
const removeButtonsElementArray = [...document.getElementsByClassName("remove-button")];

if (urlParams.has('catName')) {
    const newCatElement = document.createElement('div');
    newCatElement.classList.add('card', 'card-category', 'border', 'rounded-3','me-3','mb-3')
    newCatElement.innerHTML = `
                <div class="card-body p-20">
                    <div class="card-title h3 f-weight-500">${urlParams.get('catName')}</div>
                    <div class="actions f-weight-500">
                        <button class="btn btn-primary f-size-14 l-height-24 px-3">Редактировать</button>
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

editButtonsElementArray.forEach((btn) => {
    btn.addEventListener("click", () => {
        const catName = btn.parentElement.previousElementSibling.innerText;
        location.href = `../templates/income-edit.html?category=${catName}`;
    })
})

removeButtonsElementArray.forEach((btn) => {
    btn.addEventListener("click", () => {
        const confirmRemoveButton = document.getElementById('confirm-remove')
        const cloneBtn = confirmRemoveButton.cloneNode(true)
        confirmRemoveButton.parentNode.replaceChild(cloneBtn, confirmRemoveButton);
        cloneBtn.addEventListener('click', () => {
            btn.parentElement.parentElement.parentElement.remove();
        })
    })
})