import {HttpUtils} from "../utils/http-utils";

export class BalanceService {
    static balanceKey = 'balance'
    static async getBalance () {
        const result = await HttpUtils.request('/balance', 'GET')
        if (result.response.error || !result.response.hasOwnProperty('balance')) {
            if (result.response && result.response.message) {
                return {errorMessage: result.response.message};
            }
            return false;
        }
        return result.response;
    }

    static async saveBalanceToStorage () {
        const response = await this.getBalance();
        if (response && response.hasOwnProperty('balance')) {
            localStorage.setItem(this.balanceKey, response.balance);
        } else {
            localStorage.setItem(this.balanceKey, '#Н/Д');
        }
    }

    static clearBalance () {
        localStorage.removeItem(this.balanceKey);
    }

    static gerUserBalance () {
        return localStorage.getItem(this.balanceKey);
    }
}