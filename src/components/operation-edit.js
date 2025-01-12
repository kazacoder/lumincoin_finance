const data = JSON.parse((new URLSearchParams(window.location.search)).get('data'));
const saveButton = document.getElementById('save');
const typeSelectElement = document.getElementById('type');
const categorySelectElement = document.getElementById('category');
const amountInputElement = document.getElementById('amount');
const dateInputElement = document.getElementById('date');
const commentaryInputElement = document.getElementById('commentary');

if (data['type'] === 'расход') {
    typeSelectElement.children[2].setAttribute('selected', '')
} else if (data['type'] === 'доход') {
    typeSelectElement.children[1].setAttribute('selected', '')
}

for (let option of categorySelectElement) {
    if (option.value === data['category']) {
        option.setAttribute('selected', '')
    }
}

amountInputElement.value = data['amount'];
dateInputElement.value = new Date(data['date'].split('.').reverse().join('-')).toISOString().slice(0, 10);
commentaryInputElement.value = data['commentary'];

saveButton.addEventListener('click', (e) => {
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
        const changedData = {
            id: data.id,
            type: typeSelectElement.value,
            category: categorySelectElement.value,
            amount: amountInputElement.value,
            date: dateInputElement.value,
            commentary: commentaryInputElement.value,
        }
        location.href = `../templates/balance.html?data=${JSON.stringify(changedData)}`;
    }
})