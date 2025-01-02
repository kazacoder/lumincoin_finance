// export class MainPage {
//
// }

// import {Chart} from "../../lib/chart/dist/chart.js/auto";


const ctx = document.getElementById('myChart');
const ctx2 = document.getElementById('myChart1');

const DATA_COUNT = 5;
const NUMBER_CFG = {count: DATA_COUNT, min: 0, max: 100};

let _seed = Date.now();

const CHART_COLORS = {
    red: '#DC3545',
    orange: '#FD7E14',
    yellow: '#FFC107',
    green: '#20C997',
    blue: '#0D6EFD',
    purple: 'rgb(153, 102, 255)',
    grey: 'rgb(201, 203, 207)'
};

const data = {
    labels: ['Red', 'Orange', 'Yellow', 'Green', 'Blue'],
    datasets: [
        {
            label: 'Dataset 1',
            data: numbers(NUMBER_CFG),
            backgroundColor: Object.values(CHART_COLORS),
        }
    ]
};

const data2 = {
    labels: ['Red', 'Orange', 'Yellow', 'Green', 'Blue'],
    datasets: [
        {
            label: 'Dataset 1',
            data: numbers(NUMBER_CFG),
            backgroundColor: Object.values(CHART_COLORS),
        }
    ]
};

const config = {
    type: 'pie',
    data: data,
    options: {
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

const config2 = {
    type: 'pie',
    data: data2,
    options: {
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




function valueOrDefault(option, defaultValue) {
    return option ? option : defaultValue;

}

function rand(min, max) {
    min = valueOrDefault(min, 0);
    max = valueOrDefault(max, 0);
    _seed = (_seed * 9301 + 49297) % 233280;
    return min + (_seed / 233280) * (max - min);
}

function numbers(config) {
    const cfg = config || {};
    const min = valueOrDefault(cfg.min, 0);
    const max = valueOrDefault(cfg.max, 100);
    const from = valueOrDefault(cfg.from, []);
    const count = valueOrDefault(cfg.count, 8);
    const decimals = valueOrDefault(cfg.decimals, 8);
    const continuity = valueOrDefault(cfg.continuity, 1);
    const dfactor = Math.pow(10, decimals) || 0;
    const data = [];
    let i, value;

    for (i = 0; i < count; ++i) {
        value = (from[i] || 0) + rand(min, max);
        if (rand() <= continuity) {
            data.push(Math.round(dfactor * value) / dfactor);
        } else {
            data.push(null);
        }
    }

    return data;
}


new Chart(ctx, config);
new Chart(ctx2, config2);