
import * as def from 'class-validator';
import * as cust from '../decorators/validators';

export interface IforgotPasswordViewModel {
    email: string;
    
}

export class ForgotPasswordViewModel implements IforgotPasswordViewModel {
	@cust.Required()
	@def.Validate(cust.IsEmail)
    public email: string;
    
    constructor(model?: IforgotPasswordViewModel) {
        if(model) {
            this.email = model.email;
            
        }
    }
}
 