import {HttpUtils} from "../../utils/http-utils";

export class Balance {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.periods = document.querySelectorAll('.period-selection a');
        this.dateFromElement = document.getElementById('dateFrom');
        this.dateToElement = document.getElementById('dateTo');
        this.IntervalDurationDivElement = document.getElementById('interval-duration');
        this.createIncomeButton = document.getElementById("create-income");
        this.createExpenseButton = document.getElementById("create-expense");
        this.tableBody = document.getElementById('records');
        this.init();
        this.getBalance().then();
    }

    init() {
        const today = new Date();
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
            if (currentPeriod === 'interval') {
                this.IntervalDurationDivElement.classList.remove('d-none');
                this.IntervalDurationDivElement.classList.add('d-flex');
                this.dateFromElement.disabled = false;
                this.dateToElement.disabled = false;
                this.dateFromElement.value = (new Date(today.getFullYear(), 0, 2)).toISOString().slice(0, 10);
                this.dateToElement.value = (new Date(today.getFullYear(), today.getMonth() + 1, 1)).toISOString().slice(0, 10);
            }
        })
        this.dateFromElement.addEventListener('change', () => {
            this.tableBody.innerHTML = '';
            this.getBalance().then()
        })
        this.dateToElement.addEventListener('change', () => {
            this.tableBody.innerHTML = '';
            this.getBalance().then()
        })
    }

    async getBalance() {
        this.period = new URLSearchParams(location.search).get('period');

        let params = `?period=${this.period}`
        if (this.period === 'interval') {

            params += `&dateFrom=${this.dateFromElement.value}&dateTo=${this.dateToElement.value}`;
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
                                <button class="btn m-0 p-0 remove-button" operation-id="${operation.id}" data-bs-toggle="modal" data-bs-target="#deleteModal">
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
                    const operationId = btn.getAttribute('operation-id');
                    modal.hide()
                    btn.parentElement.parentElement.parentElement.remove();
                    HttpUtils.request(`/operations/${operationId}`, 'DELETE').then()
                })
            })
        })
    }
}


