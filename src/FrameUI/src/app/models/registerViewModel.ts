import {Contains, IsInt, IsLength, IsEmail, IsFQDN, IsDate} from "validator.ts/decorator/Validation";

export interface IregisterViewModel {
    email: string;
    password: string;
    confirmPassword: string;
    isAdmin: boolean;
    
}

export class RegisterViewModel implements IregisterViewModel {
    @IsEmail()
    public email: string;
    public password: string;
    public confirmPassword: string;
    public isAdmin: boolean;
    
    constructor(model?: IregisterViewModel) {
        if (model) {
            this.email = model.email;
            this.password = model.password;
            this.confirmPassword = model.confirmPassword;
            this.isAdmin = model.isAdmin;
            
        }
    }
}
