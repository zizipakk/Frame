import * as def from 'class-validator';
import * as cust from '../decorators/validators';

export interface IresetPasswordViewModel {
    email: string;
    password: string;
    confirmPassword: string;
    code: string;
    
}

export class ResetPasswordViewModel implements IresetPasswordViewModel {
	@cust.Required()
	@def.Validate(cust.IsEmail)
    public email: string;
    
	@cust.Required()
	@def.Validate(cust.Length, [{ min: "the {0} must be at least  and at max {1} characters long.", max: 100 }])
    public password: string;
    
	@cust.IsEqualThan("password")
    public confirmPassword: string;
    
    public code: string;
    
    constructor(model?: IresetPasswordViewModel) {
        if(model) {
            this.email = model.email;
            this.password = model.password;
            this.confirmPassword = model.confirmPassword;
            this.code = model.code;
            
        }
    }
}
 