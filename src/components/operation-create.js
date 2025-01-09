const type = (new URLSearchParams(window.location.search)).get('type');

if (type === 'income') {
    document.getElementById('type').children[1].setAttribute('selected', '');
} else if (type === 'expense') {
    document.getElementById('type').children[2].setAttribute('selected', '');
}

