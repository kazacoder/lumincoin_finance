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
        location.href = `../templates/pages/categories/categories-income.html`;
        return;
    }
    location.href = `../templates/pages/categories/categories-income.html`;
})


