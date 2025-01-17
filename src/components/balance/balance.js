import {HttpUtils} from "../../utils/http-utils";

export class Balance {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.loadBalance();
        this.getBalance().then();
    }

    async getBalance() {
        const result = await HttpUtils.request('/operations', 'GET');
        console.log(result)
    }

    loadBalance() {
        const data = (new URLSearchParams(window.location.search)).get('data')
        const tableRowsNumbersElements = document.querySelectorAll('.row_number')
        const tableRowsNumbers = []
        for (let i = 0; i < tableRowsNumbersElements.length; i++) {
            tableRowsNumbers.push(tableRowsNumbersElements[i].innerText)
        }

        if (data) {
            const parsedData = JSON.parse(data)
            if (parsedData.id && tableRowsNumbers.includes(parsedData.id)) {

                let changedRowElement = null
                for (let i = 0; i < tableRowsNumbers.length; i++) {
                    if (tableRowsNumbersElements[i].innerText === parsedData.id) {
                        changedRowElement = tableRowsNumbersElements[i].parentElement
                        changedRowElement.children[2].innerText = parsedData.category
                        changedRowElement.children[3].innerText = `${parseInt(parsedData.amount).toLocaleString()}$`
                        changedRowElement.children[4].innerText = (new Date(parsedData.date)).toLocaleDateString()
                        changedRowElement.children[5].innerText = parsedData.commentary
                        console.log(changedRowElement.children[2]);
                        break;
                    }

                }
            } else {
                const trElement = document.createElement("tr");
                const thElement = document.createElement("th");
                thElement.setAttribute('scope', 'row');
                thElement.classList.add('row_number');
                thElement.innerText = document.getElementById('balance-table').rows.length
                trElement.appendChild(thElement)
                const typeCellElement = document.createElement("td");
                typeCellElement.innerText = parsedData.type
                if (parsedData.type === "расход") {
                    typeCellElement.classList.add('text-danger')
                } else {
                    typeCellElement.classList.add('text-success')
                }
                trElement.appendChild(typeCellElement)

                trElement.insertCell().innerText = parsedData.category
                trElement.insertCell().innerText = `${parseInt(parsedData.amount).toLocaleString()}$`
                trElement.insertCell().innerText = (new Date(parsedData.date)).toLocaleDateString()
                trElement.insertCell().innerText = parsedData.commentary
                trElement.insertCell().innerHTML = `
                            <div class="balance-table__actions">
                                <button class="btn m-0 p-0 remove-button" data-bs-toggle="modal" data-bs-target="#deleteModal">
                                    <i class="bi bi-trash"></i>
                                </button>
                                <button class="btn m-0 p-0 edit-operation">
                                    <i class="bi bi-pencil"></i>
                                </button>
                            </div>
    `
                document.getElementById('records').appendChild(trElement);
            }
        }

        const editButtonElementsArray = [...document.getElementsByClassName('edit-operation')]

        editButtonElementsArray.forEach(button => {
            button.addEventListener('click', (e) => {
                const currentRow = e.target.parentElement.parentElement.parentElement.parentElement.children
                const data = {
                    id: currentRow[0].innerText,
                    type: currentRow[1].innerText,
                    category: currentRow[2].innerText,
                    amount: parseInt(currentRow[3].innerText.match(/\d/g).join('')),
                    date: currentRow[4].innerText,
                    commentary: currentRow[5].innerText,
                }
                this.openNewRoute(`/balance/edit?data=${JSON.stringify(data)}`);
            })
        })

        const modal = new bootstrap.Modal(document.getElementById('deleteModal'), {});
        const removeButtonsElementArray = [...document.getElementsByClassName("remove-button")];

        removeButtonsElementArray.forEach((btn) => {
            btn.addEventListener("click", () => {
                const confirmRemoveButton = document.getElementById('confirm-remove')
                const cloneBtn = confirmRemoveButton.cloneNode(true)
                confirmRemoveButton.parentNode.replaceChild(cloneBtn, confirmRemoveButton);
                cloneBtn.addEventListener('click', () => {
                    modal.hide()
                    btn.parentElement.parentElement.parentElement.remove();
                })
            })
        })
    }
}


