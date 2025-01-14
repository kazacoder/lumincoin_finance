import {MainPage} from "./components/main-page";
import {Balance} from "./components/balance";
import {Login} from "./components/login";
import {SignUp} from "./components/sign-up";
import {CategoriesExpense} from "./components/categories-expense";
import {CategoriesIncome} from "./components/categories-income";
import {IncomeEdit} from "./components/income-edit";


export class Router {
    constructor() {
        this.titlePageElement = document.getElementById('title');
        this.contentPageElement = document.getElementById('content');
        this.initEvents();
        this.routes = {
            '/': {
                title: 'Главная',
                filePathTemplate: '/templates/pages/main.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new MainPage()
                },
                styles: [],
                scripts: ['chart.umd.js'],
                unload: () => {

                }
            },
            '/login': {
                title: 'Вход',
                filePathTemplate: '/templates/pages/auth/login.html',
                useLayout: null,
                load: () => {
                    new Login(this.openNewRoute.bind(this));
                },
                styles: [],
                scripts: [],
                unload: () => {

                }
            },
            '/sign-up': {
                title: 'Регистрация',
                filePathTemplate: '/templates/pages/auth/sign-up.html',
                useLayout: null,
                load: () => {
                    new SignUp(this.openNewRoute.bind(this));
                },
                styles: [],
                scripts: [],
                unload: () => {

                }
            },
            '/404': {
                title: '404',
                filePathTemplate: '/templates/pages/404.html',
                useLayout: false,
            },
            '/balance': {
                title: 'Баланс',
                filePathTemplate: '/templates/pages/balance/balance.html',
                useLayout: '/templates/layout.html',
                includes: ['/templates/includes/delete-modal.html'],
                load: () => {
                    new Balance()
                },
                styles: [],
                scripts: [],
                unload: () => {
                    document.getElementById('includes').remove()
                }
            },
            '/categories-income': {
                title: 'Категории доходов',
                filePathTemplate: '/templates/pages/categories/categories-income.html',
                useLayout: '/templates/layout.html',
                includes: ['/templates/includes/delete-modal.html'],
                load: () => {
                    new CategoriesIncome(this.openNewRoute.bind(this));
                },
                styles: [],
                scripts: [],
                unload: () => {
                    document.getElementById('includes').remove()
                }
            },
            '/categories-expense': {
                title: 'Категории доходов',
                filePathTemplate: '/templates/pages/categories/categories-expense.html',
                useLayout: '/templates/layout.html',
                includes: ['/templates/includes/delete-modal.html'],
                load: () => {
                    new CategoriesExpense(this.openNewRoute.bind(this));
                },
                styles: [],
                scripts: [],
                unload: () => {
                    document.getElementById('includes').remove()
                }
            },
            '/categories/income-edit': {
                title: 'Редактирование категории',
                filePathTemplate: '/templates/pages/categories/income-edit.html',
                useLayout: '/templates/layout.html',
                includes: [],
                load: () => {
                    new IncomeEdit(this.openNewRoute.bind(this));
                },
                styles: [],
                scripts: [],
                unload: () => {

                }
            },
        }
    }

    initEvents() {
        window.addEventListener('DOMContentLoaded', this.activateRoute.bind(this));
        window.addEventListener('popstate', this.activateRoute.bind(this));
        document.addEventListener('click', this.clickHandler.bind(this));
    }

    async openNewRoute(url) {
        const currentRoute = window.location.pathname;
        history.pushState(null, '', url);
        await this.activateRoute(null, currentRoute)
    }

    async clickHandler(e) {

        let element = null;
        if (e.target.nodeName === 'A') {
            element = e.target;
        } else if (e.target.parentNode.nodeName === 'A') {
            element = e.target.parentNode;
        }
        if (element) {
            e.preventDefault()
            const currentRoute = window.location.pathname;
            const url = element.href.replace(window.location.origin, '');

            if (!url || (currentRoute === url.replace('#', '')) || url.startsWith('javascript:void(0)')) {
                return;
            }
            await this.openNewRoute(url)
        }
    }

    async activateRoute(e, oldRoute = null) {
        if (oldRoute) {
            const currentRoute = this.routes[oldRoute];
            if (currentRoute.styles && currentRoute.styles.length > 0) {
                currentRoute.styles.forEach(style => {
                    document.querySelector(`link[href='/css/${style}']`).remove();

                });
            }
            if (currentRoute.scripts && currentRoute.scripts.length > 0) {
                currentRoute.scripts.forEach(script => {
                    document.querySelector(`script[src='/js/${script}']`).remove();

                });
            }
            if (currentRoute.unload && typeof currentRoute.load === 'function') {
                currentRoute.unload();
            }

        }


        const urlRoute = window.location.pathname;
        const newRoute = this.routes[urlRoute];

        if (newRoute) {
            let contentBlock = this.contentPageElement

            if (newRoute.includes && newRoute.includes.length > 0) {
                const includesDiv = document.createElement('div')
                includesDiv.id = 'includes'
                document.body.append(includesDiv)
                newRoute.includes.forEach(include => {
                    this.loadIncludes(include, includesDiv)
                })
            }

            if (newRoute.filePathTemplate) {
                if (newRoute.useLayout) {
                    contentBlock.innerHTML = await fetch(newRoute.useLayout).then(res => res.text());
                    contentBlock = document.getElementById('content-layout')
                }
                contentBlock.innerHTML = await fetch(newRoute.filePathTemplate).then(res => res.text());
            }

            if (newRoute.scripts && newRoute.scripts.length > 0) {
                for (const script of newRoute.scripts) {
                    await this.loadPageScript('/js/' + script);
                }
            }

            if (newRoute.title) {
                this.titlePageElement.innerText = newRoute.title + ' | Lumincoin finance';
            }

            if (newRoute.load && typeof newRoute.load === 'function') {
                newRoute.load();
            }

        } else {
            console.log('Route not found')
            history.pushState(null, '', '/404');
            await this.activateRoute();
        }
    }


    //TODO move to utils
    loadPageScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = () => resolve('Script loaded: ' + src);
            script.onerror = () => reject(new Error('Script not loaded: ' + src));
            document.body.appendChild(script);
        })
    }

    async loadIncludes(src, includesDiv) {
        const srcHtml = await fetch(src).then(response => response.text());
        const srcNewDiv = document.createElement('div');
        srcNewDiv.innerHTML = srcHtml;
        includesDiv.appendChild(srcNewDiv)
    }
}