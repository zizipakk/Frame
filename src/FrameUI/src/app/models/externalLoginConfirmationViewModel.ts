import * as def from 'class-validator';
import * as cust from '../decorators/validators';

export interface IexternalLoginConfirmationViewModel {
    email: string;
    
}

export class ExternalLoginConfirmationViewModel implements IexternalLoginConfirmationViewModel {
	@cust.Required({ message: 'This is required!' })
	@def.IsEmail({ allow_display_name: true }, { message: 'This is not valid email!' })
    public email: string;
    
    constructor(model?: IexternalLoginConfirmationViewModel) {
        if(model) {
            this.email = model.email;
            
        }
    }
}
 