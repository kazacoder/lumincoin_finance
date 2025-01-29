import {OperationType} from "./types";

export interface LoginType {
    email: string,
    password: string,
    rememberMe?: boolean,
}

export interface SignUpType extends LoginType{
    name: string,
    lastName: string,
    passwordRepeat: string,
}

export interface GetOperationParamInterface {
    (period: string,
     dateFromElement?: (HTMLInputElement | null),
     dateToElement?: (HTMLInputElement | null)): Promise<Array<OperationType>>,
}

export interface OpenNewRouteInterface {
    (url: string): Promise<void>;
}