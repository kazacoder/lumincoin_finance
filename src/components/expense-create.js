const categoryNameElement = document.getElementById("category-name");
const createButtonElement = document.getElementById("create");

createButtonElement.addEventListener("click", () => {
    categoryNameElement.classList.remove("is-invalid");

    if (!categoryNameElement.value) {
        categoryNameElement.classList.add("is-invalid");
        return;
    }
    location.href = `../templates/pages/categories/categories-expense.html`;
})