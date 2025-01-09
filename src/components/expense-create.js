const categoryNameElement = document.getElementById("category-name");
const createButtonElement = document.getElementById("create");

createButtonElement.addEventListener("click", () => {
    categoryNameElement.classList.remove("is-invalid");

    if (!categoryNameElement.value) {
        categoryNameElement.classList.add("is-invalid");
        return;
    }
    location.href = `../templates/categories-expense.html?catName=${categoryNameElement.value}`;
})