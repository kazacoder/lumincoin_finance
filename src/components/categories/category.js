import {HttpUtils} from "../../utils/http-utils";

export class Category {
    constructor(openNewRoute, type, action) {
        this.openNewRoute = openNewRoute;
        this.categoryNameElement = document.getElementById("category-name");
        this.proceedButtonElement = document.getElementById("proceed");
        this.types = {
            income: {title: 'доходов'},
            expense: {title: 'расходов'},
        }
        this.actions = {
            create: {title: 'Создание', buttonTitle: 'Создать', method: 'POST'},
            edit: {title: 'Редактирование', buttonTitle: 'Сохранить', method: 'PUT'},
        }
        this.type = type;
        this.action = action;
        this.init();
    }

    init() {
        document.querySelector('.main-content__title').innerText =
            `${this.actions[this.action].title} категории ${this.types[this.type].title}`;
        document.getElementById('cancel').href = `/categories/${this.type}`;
        this.proceedButtonElement.innerText = this.actions[this.action].buttonTitle;
        if (this.action === 'edit') {
            this.getCategory().then();
        } else {this.setCategory().then();}
    }

    async getCategory() {
        const params = new URLSearchParams(location.search)
        const catId = params.get("category");
        const result = await HttpUtils.request(`/categories/${this.type}/${catId}`, 'GET')
        this.setCategory(result.response).then();
    }

    async setCategory(category = null) {
        let idPath = ''
        if (category) {
            this.categoryNameElement.value = category.title;
            idPath = `/${category.id}`;
        }

        this.proceedButtonElement.addEventListener("click", () => {
            this.categoryNameElement.classList.remove("is-invalid");

            if (!this.categoryNameElement.value) {
                this.categoryNameElement.classList.add("is-invalid");
                return;
            }
            if ((category && this.categoryNameElement.value !== category.title) || this.action === 'create') {
                HttpUtils.request(`/categories/${this.type}${idPath}`, this.actions[this.action].method, true,
                    {title: this.categoryNameElement.value});
            }
            this.openNewRoute(`/categories/${this.type}`);
        })
    }

}




