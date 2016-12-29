

    export interface IexternalLoginConfirmationViewModel {
        email: string;
        
    }

    export class ExternalLoginConfirmationViewModel {
        public email: string;
        
        constructor(model: IexternalLoginConfirmationViewModel) {
            this.email = model.email;
            
        }
    }
 