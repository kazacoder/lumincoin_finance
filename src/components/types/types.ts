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


