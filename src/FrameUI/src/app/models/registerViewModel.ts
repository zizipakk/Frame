import { Length, IsEmail } from "class-validator";
import { IsEqualThan } from "../decorators/validators";

export interface IregisterViewModel {
    email: string;
    password: string;
    confirmPassword: string;
    isAdmin: boolean;
    
}

export class RegisterViewModel implements IregisterViewModel {
    @IsEmail({ allow_display_name: true }, { message: 'This is not valid email!' })
    public email: string;
    @Length(6, 200, { message: 'This is not valid password!' })
    public password: string;
    @IsEqualThan("password", { message: 'This is not the same!' })
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
 