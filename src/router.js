import {MainPage} from "./components/main-page";
import {Balance} from "./components/balance/balance";
import {Login} from "./components/auth/login";
import {SignUp} from "./components/auth/sign-up";
import {CategoriesExpense} from "./components/categories/categories-expense";
import {CategoriesIncome} from "./components/categories/categories-income";
import {IncomeEdit} from "./components/categories/income-edit";
import {NotFoundError} from "./components/404";
import {OperationCreate} from "./components/balance/operation-create";
import {OperationEdit} from "./components/balance/operation-edit";
import {IncomeCreate} from "./components/categories/income-create";
import {ExpenseEdit} from "./components/categories/expense-edit";
import {ExpenseCreate} from "./components/categories/expense-create";
import {Logout} from "./components/auth/logout";
import {AuthUtils} from "./utils/auth-utils";
import {BalanceService} from "./services/balance-service";


export class Router {
    constructor() {
        this.titlePageElement = document.getElementById('title');
        this.contentPageElement = document.getElementById('content');
        this.historyBackLink = null;
        this.userName = null

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
            '/logout': {
                useLayout: null,
                load: () => {
                    new Logout(this.openNewRoute.bind(this));
                },
                unload: () => {
                    this.userName = null
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
                load: () => {
                    new NotFoundError(this.historyBackLink)
                },
            },
            '/balance': {
                title: 'Баланс',
                filePathTemplate: '/templates/pages/balance/balance.html',
                useLayout: '/templates/layout.html',
                includes: ['/templates/includes/delete-modal.html'],
                load: () => {
                    new Balance(this.openNewRoute.bind(this));
                },
                styles: [],
                scripts: [],
                unload: () => {
                    document.getElementById('includes').remove()
                }
            },
            '/categories/income': {
                title: 'Категории доходов',
                filePathTemplate: '/templates/pages/categories/categories-list.html',
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
            '/categories/expense': {
                title: 'Категории расходов',
                filePathTemplate: '/templates/pages/categories/categories-list.html',
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
            '/categories/income/edit': {
                title: 'Редактирование категории',
                filePathTemplate: '/templates/pages/categories/category.html',
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
            '/categories/income/create': {
                title: 'Создание категории',
                filePathTemplate: '/templates/pages/categories/category.html',
                useLayout: '/templates/layout.html',
                includes: [],
                load: () => {
                    new IncomeCreate(this.openNewRoute.bind(this));
                },
                styles: [],
                scripts: [],
                unload: () => {

                }
            },
            '/categories/expense/edit': {
                title: 'Редактирование категории',
                filePathTemplate: '/templates/pages/categories/category.html',
                useLayout: '/templates/layout.html',
                includes: [],
                load: () => {
                    new ExpenseEdit(this.openNewRoute.bind(this));
                },
                styles: [],
                scripts: [],
                unload: () => {

                }
            },
            '/categories/expense/create': {
                title: 'Создание категории',
                filePathTemplate: '/templates/pages/categories/category.html',
                useLayout: '/templates/layout.html',
                includes: [],
                load: () => {
                    new ExpenseCreate(this.openNewRoute.bind(this));
                },
                styles: [],
                scripts: [],
                unload: () => {

                }
            },
            '/balance/create': {
                title: 'Создать операцию',
                filePathTemplate: '/templates/pages/balance/operation.html',
                useLayout: '/templates/layout.html',
                includes: [],
                load: () => {
                    new OperationCreate(this.openNewRoute.bind(this));
                },
                styles: [],
                scripts: [],
                unload: () => {

                }
            },
            '/balance/edit': {
                title: 'Редактировать операцию',
                filePathTemplate: '/templates/pages/balance/operation.html',
                useLayout: '/templates/layout.html',
                includes: [],
                load: () => {
                    new OperationEdit(this.openNewRoute.bind(this));
                },
                styles: [],
                scripts: [],
                unload: () => {

                }
            },
        }
        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey) && window.location.pathname !== '/sign-up') {
            if (this.routes[window.location.pathname]) {
                this.openNewRoute('/login').then()
            } else {this.openNewRoute('/404').then()}
        }
        this.initEvents();
    }

    initEvents() {
        window.addEventListener('DOMContentLoaded', this.activateRoute.bind(this));
        window.addEventListener('popstate', this.activateRoute.bind(this));
        document.addEventListener('click', this.clickHandler.bind(this));
    }

    async openNewRoute(url) {
        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey) && url !== '/sign-up') {
            if (this.routes[window.location.pathname]) {
               url = '/login'
            } else {url ='/404'}
        }
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
        } else if (e.target.parentNode.parentNode.nodeName === 'A') {
            element = e.target.parentNode.parentNode;
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
            this.historyBackLink = oldRoute
            if (currentRoute) {
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
                    this.activateMenuItem(window.location.pathname)

                    this.profileNameElement = document.getElementById('profile-name');
                    if (!this.userName) {
                        let userInfo = AuthUtils.getAuthInfo(AuthUtils.userInfoTokenKey);
                        if (userInfo) {
                            userInfo = JSON.parse(userInfo);
                            if (userInfo.name) {
                                this.userName = `${userInfo.name} ${userInfo.lastName}`;
                            }
                        }
                    }
                    this.profileNameElement.innerText = this.userName;

                    const balance = await BalanceService.getBalance()
                    document.getElementById('balance').innerText = `${parseInt(balance).toLocaleString()} $`

                }
                contentBlock.innerHTML = await fetch(newRoute.filePathTemplate).then(res => res.text());
                document.body.removeAttribute('style');
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

    activateMenuItem(route) {
        const menuItem = document.querySelectorAll('.sidebar .nav-link');
        menuItem.forEach(item => {
            const href = item.getAttribute('href');
            const cleanedHref = href ? href.replace(/\?.+/gm, '') : href;
            if (route.includes(cleanedHref) && '/' !== href || (route === '/' && href === '/')) {
                item.classList.add('active');
            } else item.classList.remove('active')

        })

        const categoryButton = document.getElementById('categories');
        const categoryListElement = document.getElementById('category-collapse');
        if (route.includes('categories')) {
            categoryButton.classList.add('active');
            categoryButton.classList.remove('collapsed');
            categoryButton.parentElement.classList.add('active');
            categoryButton.setAttribute('aria-expanded', 'true');
            categoryListElement.classList.add('show');
        } else {
            categoryButton.classList.add('collapsed');
            categoryButton.parentElement.classList.remove('active');
            categoryButton.setAttribute('aria-expanded', 'false');
            categoryListElement.classList.remove('show');
        }
    }
}