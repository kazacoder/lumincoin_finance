import {HttpUtils} from "../../utils/http-utils";
import {BalanceService} from "../../services/balance-service";
import {OperationsService} from "../../services/operations-service";
import {periodSelectButtonsProcessing} from "../main-page";
import {GetOperationParamInterface} from "../types/interfaces";

export class Balance {
    public periodBarElementsArray: NodeListOf<HTMLElement>;
    public dateFromElement: HTMLInputElement | null;
    public dateToElement: HTMLInputElement | null;
    public IntervalDurationDivElement: HTMLElement | null;
    private createIncomeButton: HTMLElement | null;
    private createExpenseButton: HTMLElement | null;
    private tableBody: HTMLElement | null;
    private getOperations: GetOperationParamInterface
    public period: string;

    constructor() {
        this.period = 'today';
        this.periodBarElementsArray = document.querySelectorAll('.period-selection a');
        this.dateFromElement = document.getElementById('dateFrom') as HTMLInputElement;
        this.dateToElement = document.getElementById('dateTo') as HTMLInputElement;
        this.IntervalDurationDivElement = document.getElementById('interval-duration');
        this.createIncomeButton = document.getElementById("create-income");
        this.createExpenseButton = document.getElementById("create-expense");
        this.tableBody = document.getElementById('records');
        this.getOperations = OperationsService.getOperations;
        this.init();
        this.getOperations(this.period, this.dateFromElement, this.dateToElement)
            .then(operations => {this.loadBalance(operations);});
    }

     init() {
        const currentPeriod = new URLSearchParams(location.search).get('period');
        this.createIncomeButton.href += `&period=${currentPeriod}`;
        this.createExpenseButton.href += `&period=${currentPeriod}`;
        this.period = new URLSearchParams(location.search).get('period');
        periodSelectButtonsProcessing.call(this);
        this.dateFromElement.addEventListener('change', () => {
            this.tableBody.innerHTML = '';
            this.getOperations(this.period, this.dateFromElement, this.dateToElement)
                .then(operations => {this.loadBalance(operations);})
        })
        this.dateToElement.addEventListener('change', () => {
            this.tableBody.innerHTML = '';
            this.getOperations(this.period, this.dateFromElement, this.dateToElement)
                .then(operations => {this.loadBalance(operations);})
        })
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
                    HttpUtils.request(`/operations/${operationId}`, 'DELETE').then(() => {
                        BalanceService.getBalance().then((balance) => {
                            document.getElementById('balance').innerText = `${parseInt(balance).toLocaleString()} $`
                        })
                    })
                })
            })
        })
    }
}


