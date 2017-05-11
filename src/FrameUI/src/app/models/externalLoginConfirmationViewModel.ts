export interface IexternalLoginConfirmationViewModel {
    email: string;
    
}

export class ExternalLoginConfirmationViewModel implements IexternalLoginConfirmationViewModel {
    public email: string;
    
    constructor(model?: IexternalLoginConfirmationViewModel) {
        
        if(model) {
            this.email = model.email;
            
        }
    }
}
 