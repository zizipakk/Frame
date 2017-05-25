import * as def from 'class-validator';
import * as cust from '../decorators/validators';

export interface IforgotPasswordViewModel {
    email: string;
    
}

export class ForgotPasswordViewModel implements IforgotPasswordViewModel {
	
	@def.IsEmail({ allow_display_name: true }, { message: 'This is not valid email!' })
    public email: string;
    
    constructor(model?: IforgotPasswordViewModel) {
        if(model) {
            this.email = model.email;
            
        }
    }
}
 