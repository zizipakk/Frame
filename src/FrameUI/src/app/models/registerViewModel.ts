
import * as def from 'class-validator';
import * as cust from '../decorators/validators';

export interface IregisterViewModel {
    email: string;
    password: string;
    confirmPassword: string;
    isAdmin: boolean;
    
}

export class RegisterViewModel implements IregisterViewModel {
	@cust.Required()
    public email: string;
    
	@cust.Required()
	@def.Validate(cust.Length, [{ min: 6, max: 100 }])
    public password: string;
    
	@cust.IsEqualThan("password")
    public confirmPassword: string;
    
    public isAdmin: boolean;
    
    constructor(model?: IregisterViewModel) {
        if(model) {
            this.email = model.email;
            this.password = model.password;
            this.confirmPassword = model.confirmPassword;
            this.isAdmin = model.isAdmin;
            
        }
    }
}
 