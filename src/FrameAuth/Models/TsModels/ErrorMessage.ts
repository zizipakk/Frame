
export interface IErrorMessage {
    displayMode: string;
    error: string;
    requestId: string;
    uiLocales: string

}

export class ErrorMessage {
    public displayMode: string;
    public error: string;
    public requestId: string;
    public uiLocales: string

    constructor(model: IErrorMessage) {
        this.displayMode = model.displayMode;
        this.error = model.error;
        this.requestId = model.requestId;
        this.uiLocales = model.uiLocales;
    }

}