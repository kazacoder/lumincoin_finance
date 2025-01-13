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
                scripts: ['chart.umd.js', 'main-page.js'],
            }
        ]
    }

    initEvents() {
        window.addEventListener('DOMContentLoaded', this.activateRoute.bind(this));
    }

    async activateRoute(e, oldRoute) {
        const urlRoute = window.location.pathname;
        const newRoute = this.routes.find(item => item.route === urlRoute);

        if (newRoute) {
            if (newRoute.filePathTemplate) {
                this.contentPageElement.innerHTML = await fetch(newRoute.filePathTemplate).then(res => res.text());
            }

            if (newRoute.scripts && newRoute.scripts.length > 0) {
                for (const script of newRoute.scripts) {
                    await this.loadPageScript('/js/' + script);
                }
            }

            if (newRoute.title) {
                this.titlePageElement.innerText = newRoute.title + ' | Lumincoin finance';
            }

        }
    }

    loadPageScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = () => resolve('Script loaded: ' + src);
            script.onerror = () => reject(new Error('Script not loaded: ' + src));
            document.body.appendChild(script);
        })
    }


}