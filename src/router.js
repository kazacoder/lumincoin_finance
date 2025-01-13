export class Router {
    constructor() {
        this.titlePageElement = document.getElementById('title');
        this.contentPageElement = document.getElementById('content');
        this.initEvents();
        this.routes = [
            {
                route: '/',
                title: 'Главная',
                filePathTemplate: '/templates/main.html',
                useLayout: '',
                load: () => {

                },
                styles: [],
                scripts: [],
            }
        ]
    }
    initEvents() {
        window.addEventListener('DOMContentLoaded', this.activateRoute.bind(this));
    }

    async activateRoute (e, oldRoute) {
        const urlRoute = window.location.pathname;
        const newRoute = this.routes.find(item => item.route === urlRoute);

        if (newRoute) {
            if (newRoute.filePathTemplate) {
                this.contentPageElement.innerHTML = await fetch(newRoute.filePathTemplate).then(res => res.text());
            }
        }
    }

}