import * as def from 'class-validator';
import * as cust from '../decorators/validators';
import * as res from '../app.staticResources';

export interface IregisterViewModel {
    email: string;
    password: string;
    confirmPassword: string;
    isAdmin: boolean;
    
}

export class RegisterViewModel implements IregisterViewModel {
    @cust.Required({ message: getText("Required") })
	@def.IsEmail({ allow_display_name: true }, { message: 'This is not valid email!' })
    public email: string;
    
	@cust.Required({ message: 'This is required!' })
	@def.Length(6, 200, { message: 'This is not valid password!' })
    public password: string;
    
	@cust.IsEqualThan('password', { message: 'This is not the same!' })
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

export function getText(key: string): string {
        if (res.ErrorMessages.localizedKeys)
            return res.ErrorMessages.localizedKeys.ValdationErrors[key];
        else
            return key;
}


 