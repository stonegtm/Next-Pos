export interface IResponses<T> {
    result: boolean;
    status: number;
    message: string;
    data?: T;
    [key: string]:any;
}