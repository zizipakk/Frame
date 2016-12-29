

    export interface IresetPasswordViewModel {
        email: string;
        password: string;
        confirmPassword: string;
        code: string;
        
    }

    export class ResetPasswordViewModel {
        public email: string;
        public password: string;
        public confirmPassword: string;
        public code: string;
        
        constructor(model: IresetPasswordViewModel) {
            this.email = model.email;
            this.password = model.password;
            this.confirmPassword = model.confirmPassword;
            this.code = model.code;
            
        }
    }
 