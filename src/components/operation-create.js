const type = (new URLSearchParams(window.location.search)).get('type');
const createButton = document.getElementById('create');
const typeSelectElement = document.getElementById('type');
const categorySelectElement = document.getElementById('category');
const amountInputElement = document.getElementById('amount');
const dateInputElement = document.getElementById('date');
const commentaryInputElement = document.getElementById('commentary');

if (type === 'income') {
    typeSelectElement.children[1].setAttribute('selected', '');
} else if (type === 'expense') {
    typeSelectElement.children[2].setAttribute('selected', '');
}

createButton.addEventListener('click', (e) => {
    let hasError = false;
    e.preventDefault();

    if (!categorySelectElement.value) {
        categorySelectElement.classList.add('is-invalid');
        hasError = true;
    } else {categorySelectElement.classList.remove('is-invalid');}

    if (!amountInputElement.value && !dateInputElement.value.match(/^\d+$/)) {
        amountInputElement.classList.add('is-invalid');
        hasError = true;
    } else {amountInputElement.classList.remove('is-invalid');}

    if (!dateInputElement.value) {
        dateInputElement.classList.add('is-invalid');
        hasError = true;
    } else {dateInputElement.classList.remove('is-invalid');}


    if (!hasError) {
        console.log('valid')
        const data = {
            type: typeSelectElement.value,
            category: categorySelectElement.value,
            amount: amountInputElement.value,
            date: dateInputElement.value,
            commentary: commentaryInputElement.value,
        }
        location.href = `../templates/balance.html?data=${JSON.stringify(data)}`;
    }
})


