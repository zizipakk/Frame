

    export interface IsetPasswordViewModel {
        newPassword: string;
        confirmPassword: string;
        
    }

    export class SetPasswordViewModel {
        public newPassword: string;
        public confirmPassword: string;
        
        constructor(model: IsetPasswordViewModel) {
            this.newPassword = model.newPassword;
            this.confirmPassword = model.confirmPassword;
            
        }
    }
 