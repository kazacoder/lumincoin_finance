const categoryNameElement = document.getElementById("category-name");
const createButtonElement = document.getElementById("create");

createButtonElement.addEventListener("click", (e) => {
    categoryNameElement.classList.remove("is-invalid");

    if (!categoryNameElement.value) {
        categoryNameElement.classList.add("is-invalid");
        return;
    }
    location.href = `../templates/pages/categories/categories-income.html`;
})