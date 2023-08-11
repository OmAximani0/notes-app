export {};

declare global {
    interface CustomResponse {
        error?: Array<string>;
        message?: string;
        token?: string;
    }
}
