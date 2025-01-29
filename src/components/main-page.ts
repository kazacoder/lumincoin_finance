import {HttpUtils} from "../utils/http-utils";
import {OperationsService} from "../services/operations-service";
import {Balance} from "./balance/balance";
import {AggregatedDataType, CategoryKindType, CategoryResponseType, OperationType} from "./types/types";
import {Chart, registerables} from "chart.js";
import {ChartConfiguration, ChartData, ChartItem} from "chart.js/dist/types";
import {GetOperationParamInterface} from "./types/interfaces";

Chart.register(...registerables)

export function periodSelectButtonsProcessing(this: MainPage | Balance): void {
    const today: Date = new Date();
    this.periodBarElementsArray.forEach((element: HTMLElement) => {
        element.classList.remove('btn-secondary');
        element.classList.add('btn-outline-secondary');
        if (element.id === this.period) {
            element.classList.add('btn-secondary');
            element.classList.remove('btn-outline-secondary');
        }
        if (this.period === 'interval' && this.dateFromElement && this.dateToElement && this.IntervalDurationDivElement) {
            this.IntervalDurationDivElement.classList.remove('d-none');
            this.IntervalDurationDivElement.classList.add('d-flex');
            this.dateFromElement.disabled = false;
            this.dateToElement.disabled = false;
            this.dateFromElement.value = (new Date(today.getFullYear(), 0, 2)).toISOString().slice(0, 10);
            this.dateToElement.value = (new Date(today.getFullYear(), today.getMonth() + 1, 1)).toISOString().slice(0, 10);
        }
    })
}

export class MainPage {
    public period: string;
    readonly totalIncomesSpanElement: HTMLElement | null;
    readonly totalExpensesSpanElement: HTMLElement | null;
    public periodBarElementsArray: NodeListOf<HTMLElement>;
    public IntervalDurationDivElement: HTMLElement | null;
    public dateFromElement: HTMLInputElement | null;
    public dateToElement: HTMLInputElement | null;
    readonly getOperations: GetOperationParamInterface;
    private incomesChart: any;
    private expensesChart: any;

    constructor() {
        this.period = 'today';
        this.totalIncomesSpanElement = document.getElementById("total-incomes");
        this.totalExpensesSpanElement = document.getElementById("total-expenses");
        this.periodBarElementsArray = document.querySelectorAll('.period-selection a');
        this.IntervalDurationDivElement = document.getElementById('interval-duration');
        this.dateFromElement = document.getElementById('dateFrom') as HTMLInputElement;
        this.dateToElement = document.getElementById('dateTo') as HTMLInputElement;
        this.getOperations = OperationsService.getOperations;
        this.init().then();
    }

    private async init(): Promise<void> {

        let currentPeriod: string | null = new URLSearchParams(location.search).get('period');
        this.period = currentPeriod ? currentPeriod : 'today';
        periodSelectButtonsProcessing.call(this);
        const operations: Array<OperationType> = await this.getOperations(this.period, this.dateFromElement, this.dateToElement);
        this.loadCharts(operations).then();
        if (this.dateFromElement) {
            this.dateFromElement.addEventListener('change', this.intervalChangedEventListenerFunc.bind(this));
        }
        if (this.dateToElement) {
            this.dateToElement.addEventListener('change', this.intervalChangedEventListenerFunc.bind(this));
        }
    }

    async intervalChangedEventListenerFunc(): Promise<void> {
        this.incomesChart.destroy()
        this.expensesChart.destroy()
        const balance: OperationType[] = await this.getOperations(this.period, this.dateFromElement, this.dateToElement);
        this.loadCharts(balance).then();
    }

    async getCategoryAggregation(data: OperationType[], type: CategoryKindType): Promise<AggregatedDataType> {
        const categoriesRequestResult = await HttpUtils.request(`/categories/${type}`, 'GET');
        const categoriesObject: { [key: string]: number } = {};
        categoriesRequestResult.response.forEach((element: CategoryResponseType) => categoriesObject[element.title] = element.id);

        const total: number = data.reduce((acc: number, cur) => acc + cur.amount, 0)
        const result: { [key: string]: number } = data.reduce((acc: { [key: string]: number }, cur) => {
            acc[cur.category as string] = cur.amount + (acc[cur.category as string] || 0);
            return acc;
        }, {})

        let resultArray: [string, number, number][] = Object.keys(result).map(key => [key, result[key], categoriesObject[key]]);

        resultArray.sort((a: [string, number, number], b: [string, number, number]) => a[2] - b[2]);

        return {
            labels: resultArray.map(item => item[0]),
            amounts: resultArray.map(item => item[1]),
            total: total
        }
    }

    async loadCharts(operations: OperationType[]) {
        const incomes: AggregatedDataType = await this.getCategoryAggregation(operations.filter(element => element.type === 'income'), 'income');
        const expenses: AggregatedDataType = await this.getCategoryAggregation(operations.filter(element => element.type === 'expense'), 'expense');
        const incomesCanvasElement = document.getElementById('incomes-chart') as ChartItem;
        const expensesCanvasElement = document.getElementById('expenses-chart') as ChartItem;


        const CHART_COLORS: { [key: string]: string } = {
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
        const numberOfColors: number = Math.max(incomes.amounts.length, expenses.amounts.length) - 9;

        for (let i = 0; i < numberOfColors; i++) {
            CHART_COLORS['color' + i] = `rgb(${rand(0, 255)}, ${rand(0, 255)}, ${rand(0, 255)})`;
        }

        function rand(frm: number, to: number): number {
            return ~~(Math.random() * (to - frm)) + frm;
        }

        const incomesData: ChartData<"pie"> = {
            labels: incomes.labels,
            datasets: [
                {
                    label: 'Доходы',
                    data: incomes.amounts,
                    backgroundColor: Object.values(CHART_COLORS),
                }
            ]
        };

        const expensesData: ChartData<"pie"> = {
            labels: expenses.labels,
            datasets: [
                {
                    label: 'Расходы',
                    data: expenses.amounts,
                    backgroundColor: Object.values(CHART_COLORS),
                }
            ],
        };

        const incomesConfig: ChartConfiguration<"pie"> = {
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

        const expensesConfig: ChartConfiguration<"pie"> = {
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

        if (this.totalIncomesSpanElement) {
            this.totalIncomesSpanElement.innerText = incomes.total.toLocaleString() + ' $'
        }
        if (this.totalExpensesSpanElement) {
            this.totalExpensesSpanElement.innerText = expenses.total.toLocaleString() + ' $'
        }
        this.incomesChart = new Chart(incomesCanvasElement, incomesConfig);
        this.expensesChart = new Chart(expensesCanvasElement, expensesConfig);
    }
}
