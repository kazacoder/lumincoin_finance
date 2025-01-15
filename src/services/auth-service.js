import {HttpUtils} from "../utils/http-utils";

export class AuthService {
    static async logIn(data) {
        const result = await HttpUtils.request('/login', 'POST', false, data);

        if (result.response.error || !result.response.tokens || !result.response.user) {
            if (result.response && result.response.message) {
                return {errorMessage: result.response.message};
            }
            return false;
        }
        return result.response;
    }

    static async signUp(data) {
        const result = await HttpUtils.request('/signup', 'POST', false, data);

        if (result.error || !result.response || (result.response && (!result.response.accessToken ||
            !result.response.refreshToken || !result.response.id || !result.response.name))) {
            if (result.response && result.response.message) {
                return {errorMessage: result.response.message};
            }
            return false;
        }
        return result.response;
    }

    static async logOut (data) {
        await HttpUtils.request('/logout', 'POST', false, data);
    }
}