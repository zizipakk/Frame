
import * as def from 'class-validator';
import * as cust from '../decorators/validators';

export interface IchangePasswordViewModel {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
    
}

export class ChangePasswordViewModel implements IchangePasswordViewModel {
	@cust.Required()
    public oldPassword: string;
    
	@cust.Required()
	@def.Validate(cust.Length, [{ min: "the {0} must be at least  and at max {1} characters long.", max: 100 }])
    public newPassword: string;
    
	@cust.IsEqualThan("newpassword")
    public confirmPassword: string;
    
    constructor(model?: IchangePasswordViewModel) {
        if(model) {
            this.oldPassword = model.oldPassword;
            this.newPassword = model.newPassword;
            this.confirmPassword = model.confirmPassword;
            
        }
    }
}
 