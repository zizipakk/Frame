

export interface IchangePasswordViewModel {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
    
}

export class ChangePasswordViewModel implements IchangePasswordViewModel {
    public oldPassword: string;
    public newPassword: string;
    public confirmPassword: string;
    
    constructor(model?: IchangePasswordViewModel) {
        if(model) {
            this.oldPassword = model.oldPassword;
            this.newPassword = model.newPassword;
            this.confirmPassword = model.confirmPassword;
            
        }
    }
}
 