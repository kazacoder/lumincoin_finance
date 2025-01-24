import {HttpUtils} from "../utils/http-utils";

export class BalanceService {
    static async getBalance () {
        const result = await HttpUtils.request('/balance', 'GET')
        if (result.response.error || !result.response.hasOwnProperty('balance')) {
            if (result.response && result.response.message) {
                return {errorMessage: result.response.message};
            }
            return false;
        }
        return result.response.balance;
    }
}