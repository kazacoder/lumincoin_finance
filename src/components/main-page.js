import {HttpUtils} from "../utils/http-utils";

export class MainPage {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.period = 'today'
        this.totalIncomesSpanElement = document.getElementById("total-incomes");
        this.totalExpensesSpanElement = document.getElementById("total-expenses");
        this.periodElementsCollection = document.querySelectorAll('.period-selection a');
        this.IntervalDurationDivElement = document.getElementById('interval-duration');
        this.dateFromElement = document.getElementById('dateFrom');
        this.dateToElement = document.getElementById('dateTo');
        this.init().then();
    }

    async init() {

        let currentPeriod = new URLSearchParams(location.search).get('period');
        this.period = currentPeriod ? currentPeriod : 'today';

        this.periodSelectButtonsProcessing();

        const balance = await this.getBalance();
        this.loadCharts(balance).then();

        this.dateFromElement.addEventListener('change', this.intervalChangedEventListenerFunc.bind(this));
        this.dateToElement.addEventListener('change', this.intervalChangedEventListenerFunc.bind(this));
    }

    periodSelectButtonsProcessing () {
        const today = new Date();
        this.periodElementsCollection.forEach(element => {
            element.classList.remove('btn-secondary');
            element.classList.add('btn-outline-secondary');
            if (element.id === this.period) {
                element.classList.add('btn-secondary');
                element.classList.remove('btn-outline-secondary');
            }
            if (this.period === 'interval') {
                this.IntervalDurationDivElement.classList.remove('d-none');
                this.IntervalDurationDivElement.classList.add('d-flex');
                this.dateFromElement.disabled = false;
                this.dateToElement.disabled = false;
                this.dateFromElement.value = (new Date(today.getFullYear(), 0, 2)).toISOString().slice(0, 10);
                this.dateToElement.value = (new Date(today.getFullYear(), today.getMonth() + 1, 1)).toISOString().slice(0, 10);
            }
        })
    }

    async intervalChangedEventListenerFunc () {
        this.incomesChart.destroy()
        this.expensesChart.destroy()
        const balance = await this.getBalance();
        this.loadCharts(balance).then();
    }

    async getBalance() {
        let params = `?period=${this.period}`
        if (this.period === 'interval') {
            params += `&dateFrom=${this.dateFromElement.value}&dateTo=${this.dateToElement.value}`;
        } else if (this.period === 'today') {
            const today = new Date().toISOString().slice(0, 10);
            params = `?period=interval&dateFrom=${today}&dateTo=${today}`;
        }
        const result = await HttpUtils.request(`/operations${params}`, 'GET');
        return result.response
    }


    async getCategoryAggregation(data, type) {
        const categoriesRequestResult = await HttpUtils.request(`/categories/${type}`, 'GET');
        const categoriesObject = {};
        categoriesRequestResult.response.forEach(element => categoriesObject[element.title] = element.id);

        const total = data.reduce((acc, cur) => acc + cur.amount, 0)
        const result = data.reduce((acc, cur) => {
            acc[cur.category] = cur.amount + parseInt(acc[cur.category] || 0);
            return acc;
        }, {})
        let resultArray = Object.keys(result).map(key => [key, result[key], categoriesObject[key]]);

        resultArray.sort((a, b) => a[2] - b[2]);

        return {
            labels: resultArray.map(item => item[0]),
            amounts: resultArray.map(item => item[1]),
            total: total
        }
    }

    async loadCharts(balance) {
        const incomes = await this.getCategoryAggregation(balance.filter(element => element.type === 'income'), 'income');
        const expenses = await this.getCategoryAggregation(balance.filter(element => element.type === 'expense'), 'expense');
        const incomesCanvasElement = document.getElementById('incomes-chart');
        const expensesCanvasElement = document.getElementById('expenses-chart');


        const CHART_COLORS = {
            red: '#DC3545',
            orange: '#FD7E14',
            yellow: '#FFC107',
            green: '#20C997',
            blue: '#0D6EFD',
            purple: 'rgb(153, 102, 255)',
            grey: 'rgb(201, 203, 207)',
            pink: 'rgb(170,68,120)',
            brown: 'rgb(73,9,9)',
        };

        // adding colors to CHART_COLORS pallet
        const numberOfColors = Math.max(incomes.amounts.length, expenses.amounts.length) - 9;

        for (let i = 0; i < numberOfColors; i++) {
            console.log(i)
            CHART_COLORS['color' + i] = `rgb(${rand(0, 255)}, ${rand(0, 255)}, ${rand(0, 255)})`;
        }

        function rand(frm, to) {
            return ~~(Math.random() * (to - frm)) + frm;
        }

        const incomesData = {
            labels: incomes.labels,
            datasets: [
                {
                    label: 'Доходы',
                    data: incomes.amounts,
                    backgroundColor: Object.values(CHART_COLORS),
                }
            ]
        };

        const expensesData = {
            labels: expenses.labels,
            datasets: [
                {
                    label: 'Расходы',
                    data: expenses.amounts,
                    backgroundColor: Object.values(CHART_COLORS),
                }
            ],
        };

        const incomesConfig = {
            type: 'pie',
            data: incomesData,
            options: {
                radius: '90%',
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: false,
                        text: 'Доходы'
                    }
                }
            },
        };

        const expensesConfig = {
            type: 'pie',
            data: expensesData,
            options: {
                radius: '90%',
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: false,
                        text: 'Расходы'
                    }
                }
            },
        };

        this.totalIncomesSpanElement.innerText = incomes.total.toLocaleString() + ' $'
        this.totalExpensesSpanElement.innerText = expenses.total.toLocaleString() + ' $'
        this.incomesChart = new Chart(incomesCanvasElement, incomesConfig);
        this.expensesChart = new Chart(expensesCanvasElement, expensesConfig);
    }
}



