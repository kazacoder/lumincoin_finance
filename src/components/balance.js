const editButtonElementsArray = [...document.getElementsByClassName('edit-operation')]

editButtonElementsArray.forEach(button => {
    button.addEventListener('click', (e) => {
        const currentRow = e.target.parentElement.parentElement.parentElement.parentElement.children
        const data = {
            type: currentRow[1].innerText,
            category: currentRow[2].innerText,
            amount: parseInt(currentRow[3].innerText.replace(' ', '')),
            date: currentRow[4].innerText,
            commentary: currentRow[5].innerText,
        }
        location.href = `../templates/operation-edit.html?data=${JSON.stringify(data)}`
    })
})
