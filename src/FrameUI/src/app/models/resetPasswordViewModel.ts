

export interface IresetPasswordViewModel {
    email: string;
    password: string;
    confirmPassword: string;
    code: string;
    
}

export class ResetPasswordViewModel implements IresetPasswordViewModel {
    public email: string;
    public password: string;
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
 