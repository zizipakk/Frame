

    export interface IloginViewModel {
        email: string;
        password: string;
        rememberMe: boolean;
        
    }

    export class LoginViewModel {
        public email: string;
        public password: string;
        public rememberMe: boolean;
        
        constructor(model: IloginViewModel) {
            this.email = model.email;
            this.password = model.password;
            this.rememberMe = model.rememberMe;
            
        }
    }
 