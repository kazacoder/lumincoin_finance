import {HttpUtils} from "../../utils/http-utils";

export class Balance {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.periods = document.querySelectorAll('.period-selection a');
        this.createIncomeButton = document.getElementById("create-income");
        this.createExpenseButton = document.getElementById("create-expense");
        this.init();
        this.getBalance().then();
    }

    init() {
        const currentPeriod = new URLSearchParams(location.search).get('period');
        this.createIncomeButton.href += `&period=${currentPeriod}`;
        this.createExpenseButton.href += `&period=${currentPeriod}`;
        this.periods.forEach(period => {
            period.classList.remove('btn-secondary');
            period.classList.add('btn-outline-secondary');
            if (period.id === currentPeriod) {
                period.classList.add('btn-secondary');
                period.classList.remove('btn-outline-secondary');
            }
        })
    }

    async getBalance() {
        this.period = new URLSearchParams(location.search).get('period');

        let params = `?period=${this.period}`
        if (this.period === 'interval') {

            params += `&dateFrom=2022-09-12&dateTo=2022-09-13`;
        } else if (this.period === 'today') {
            const today = new Date().toISOString().slice(0, 10);
            params = `?period=interval&dateFrom=${today}&dateTo=${today}`;
        }
        const result = await HttpUtils.request(`/operations${params}`, 'GET');
        this.loadBalance(result.response);
    }

    loadBalance(operations) {
        operations.forEach(operation => {
            const trElement = document.createElement("tr");
            const thElement = document.createElement("th");
            thElement.setAttribute('scope', 'row');
            thElement.classList.add('row_number');
            thElement.innerText = operation.id
            trElement.appendChild(thElement)
            const typeCellElement = document.createElement("td");
            typeCellElement.innerText = operation.type  === 'income' ? 'доход' : 'расход'
            if (operation.type === "expense") {
                typeCellElement.classList.add('text-danger')
            } else {
                typeCellElement.classList.add('text-success')
            }
            trElement.appendChild(typeCellElement)

            trElement.insertCell().innerText = operation.category ? operation.category.toLocaleLowerCase(): '';
            trElement.insertCell().innerText = `${parseInt(operation.amount).toLocaleString()}$`;
            trElement.insertCell().innerText = (new Date(operation.date)).toLocaleDateString();
            trElement.insertCell().innerText = operation.comment;
            trElement.insertCell().innerHTML = `
                            <div class="balance-table__actions">
                                <button class="btn m-0 p-0 remove-button" data-bs-toggle="modal" data-bs-target="#deleteModal">
                                    <i class="bi bi-trash"></i>
                                </button>
                                <a href="/balance/edit?operationId=${operation.id}&period=${this.period}" class="btn m-0 p-0 edit-operation">
                                    <i class="bi bi-pencil"></i>
                                </a>
                            </div>
    `
            document.getElementById('records').appendChild(trElement);
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


