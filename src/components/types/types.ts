export type RouteTypes = {
    [key: string]: RouteType;
}

export type RouteType = {
    title?: string,
        filePathTemplate?: string,
        useLayout: string | null,
        includes?: string[],
        load(): void,
        styles?: string[],
        scripts?: string[],
        unload?(): void,
}

export enum AuthUtilsKeys {
    accessTokenKey= 'accessToken',
    refreshTokenKey= 'refreshToken',
    userInfoTokenKey= 'userInfo',
}

export type AuthInfoType = {
    [key in AuthUtilsKeys]: string | null;
}

export type UserInfoType = {
    id: number,
    name: string,
    lastName: string,
}

export interface LoginType {
    email: string,
    password: string,
    rememberMe?: boolean,
}

export interface SignUpType extends LoginType{
    name: string,
    lastName: string,
    passwordRepeat: boolean,
}

export type LogOutType = {
    refreshToken: string,
}

export type CommonErrorType = {
    errorMessage: string,
}

export type LoginResponseType = {
    tokens: {
        accessToken: string,
        refreshToken: string
    },
    user: {
        name: string,
        lastName: string,
        id: number,
    },
}
