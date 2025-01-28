import {HttpUtils} from "../../utils/http-utils";
import {OpenNewRouteInterface} from "../types/interfaces";
import {CategoryResponseType} from "../types/types";

export class Category {
    readonly openNewRoute: OpenNewRouteInterface;
    readonly categoryNameElement: HTMLInputElement | null;
    readonly proceedButtonElement: HTMLElement | null;
    private types: { income: { title: string }; expense: { title: string } };
    private actions: {
        edit: { method: string; buttonTitle: string; title: string };
        create: { method: string; buttonTitle: string; title: string }
    };
    readonly type: 'income' | 'expense';
    readonly action: 'edit' | 'create';

    constructor(openNewRoute: OpenNewRouteInterface, type: 'income' | 'expense', action: 'edit' | 'create') {
        this.openNewRoute = openNewRoute;
        this.categoryNameElement = document.getElementById("category-name") as HTMLInputElement;
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

    private init(): void {
        const mainTitleElement = document.querySelector('.main-content__title') as HTMLElement;
        mainTitleElement.innerText = `${this.actions[this.action].title} категории ${this.types[this.type].title}`;
        const cancelButton = document.getElementById('cancel') as HTMLLinkElement;
        cancelButton ? cancelButton.href = `/categories/${this.type}` : null;
        this.proceedButtonElement ? this.proceedButtonElement.innerText = this.actions[this.action].buttonTitle : null;
        if (this.action === 'edit') {
            this.getCategory().then();
        } else {this.setCategory().then();}
    }

    private async getCategory(): Promise<void> {
        const params = new URLSearchParams(location.search)
        const catId = params.get("category");
        const result = await HttpUtils.request(`/categories/${this.type}/${catId}`, 'GET')
        this.setCategory(result.response).then();
    }

    private async setCategory(category: CategoryResponseType | null = null): Promise<void> {
        let idPath = ''
        if (category && this.categoryNameElement) {
            this.categoryNameElement.value = category.title;
            idPath = `/${category.id}`;
        }

        if (this.proceedButtonElement && this.categoryNameElement) {
            this.proceedButtonElement.addEventListener("click", () => {
                this.categoryNameElement!.classList.remove("is-invalid");

                if (!this.categoryNameElement!.value) {
                    this.categoryNameElement!.classList.add("is-invalid");
                    return;
                }
                if ((category && this.categoryNameElement!.value !== category.title) || this.action === 'create') {
                    HttpUtils.request(`/categories/${this.type}${idPath}`, this.actions[this.action].method, true,
                        {title: this.categoryNameElement!.value});
                }
                this.openNewRoute(`/categories/${this.type}`);
            })
        }
    }

}




