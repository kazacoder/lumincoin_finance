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
    accessTokenKey = 'accessToken',
    refreshTokenKey = 'refreshToken',
    userInfoTokenKey = 'userInfo',
}

export type AuthInfoType = {
    [key in AuthUtilsKeys]: string | null;
}

export type UserInfoType = {
    id: number,
    name: string,
    lastName: string,
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

export type OperationType = {
    id: number,
    type: string,
    amount: number,
    date: string,
    comment: string,
    category: string,
}

export type CategoryKindType = "income" | "expense"

export type CategoryResponseType = {
    id: number,
    title: string,
}

export type AggregatedDataType = {
    labels: string[],
    amounts: number[],
    total: number,
}

