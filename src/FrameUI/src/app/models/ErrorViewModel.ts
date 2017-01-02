

    export interface IerrorViewModel {
        error: ErrorMessage;
        
    }

    export class ErrorViewModel {
        public error: ErrorMessage;
        
        constructor(model: IerrorViewModel) {
            this.error = model.error;
            
        }
    }
 