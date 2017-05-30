import * as def from 'class-validator';
import * as cust from '../decorators/validators';

export interface IexternalLoginConfirmationViewModel {
    email: string;
    
}

export class ExternalLoginConfirmationViewModel implements IexternalLoginConfirmationViewModel {
	@cust.Required()
	@def.Validate(cust.IsEmail)
    public email: string;
    
    constructor(model?: IexternalLoginConfirmationViewModel) {
        if(model) {
            this.email = model.email;
            
        }
    }
}
 