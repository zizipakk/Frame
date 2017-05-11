

export interface IsetPasswordViewModel {
    newPassword: string;
    confirmPassword: string;
    
}

export class SetPasswordViewModel implements IsetPasswordViewModel {
    public newPassword: string;
    public confirmPassword: string;
    
    constructor(model?: IsetPasswordViewModel) {
        if(model) {
            this.newPassword = model.newPassword;
            this.confirmPassword = model.confirmPassword;
            
        }
    }
}
 