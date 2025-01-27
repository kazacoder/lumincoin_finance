import {HttpUtils} from "../utils/http-utils";
import {CommonErrorType, LoginResponseType, LogOutType} from "../components/types/types";
import {LoginType, SignUpType} from "../components/types/interfaces";

export class AuthService {
    public static async logIn(data: LoginType): Promise<LoginResponseType | CommonErrorType | null> {
        const result = await HttpUtils.request('/login', 'POST', false, data);

        if (result.response.error || !result.response.tokens || !result.response.user) {
            if (result.response && result.response.message) {
                return {errorMessage: result.response.message};
            }
            return null;
        }
        return result.response;
    }

    public static async signUp(data: SignUpType): Promise<CommonErrorType | LoginResponseType | null> {
        const result = await HttpUtils.request('/signup', 'POST', false, data);

        if (result.response.error || !result.response.user) {
            if (result.response && result.response.message) {
                return {errorMessage: result.response.message};
            }
            return null;
        }

        return await this.logIn({
            email: data.email,
            password: data.password,
            rememberMe: false,
        })
    }

    public static async logOut(data: LogOutType): Promise<void> {
        await HttpUtils.request('/logout', 'POST', false, data);
    }
}