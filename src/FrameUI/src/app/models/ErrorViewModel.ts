import { IErrorMessage, ErrorMessage } from './ErrorMessage';

export interface IerrorViewModel {
    error: IErrorMessage;
        
}

export class ErrorViewModel {
    public error: ErrorMessage;
        
    constructor(model: IerrorViewModel) {
        this.error = model.error;
            
    }
}
 