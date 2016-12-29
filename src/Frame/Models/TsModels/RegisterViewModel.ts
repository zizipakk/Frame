

    export interface IregisterViewModel {
        email: string;
        password: string;
        confirmPassword: string;
        
    }

    export class RegisterViewModel {
        public email: string;
        public password: string;
        public confirmPassword: string;
        
        constructor(model: IregisterViewModel) {
            this.email = model.email;
            this.password = model.password;
            this.confirmPassword = model.confirmPassword;
            
        }
    }
 