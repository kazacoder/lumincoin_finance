import {AuthUtils} from "../../utils/auth-utils";
import {AuthService} from "../../services/auth-service";

export class Logout {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.refreshToken = AuthUtils.getAuthInfo(AuthUtils.refreshTokenKey)
        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey) || !this.refreshToken) {
            return this.openNewRoute('/login')
        }
        this.logout().then()
    }

    async logout() {
        await AuthService.logOut({refreshToken: this.refreshToken});
        AuthUtils.removeAuthInfo();
        this.openNewRoute('/login')
    }
}

