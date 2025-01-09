const data = JSON.parse((new URLSearchParams(window.location.search)).get('data'));

const typeElement = document.getElementById('type');
const categoryElement = document.getElementById('category');
const amountElement = document.getElementById('amount');
const dateElement = document.getElementById('date');
const commentaryElement = document.getElementById('commentary');

if (data['type'] === 'расход') {
    typeElement.children[2].setAttribute('selected', '')
} else if (data['type'] === 'доход') {
    typeElement.children[1].setAttribute('selected', '')
}

for (let option of categoryElement) {
    if (option.value === data['category']) {
        option.setAttribute('selected', '')
    }
}

amountElement.value = data['amount'];
dateElement.value = data['date'];
commentaryElement.value = data['commentary'];

