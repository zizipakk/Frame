

    export interface IloginViewModel {
        enableLocalLogin: boolean;
        //externalProviders: ExternalProvider[];
        
    }

    export class LoginViewModel {
        public enableLocalLogin: boolean;
        //public externalProviders: ExternalProvider[];
        
        constructor(model: IloginViewModel) {
            this.enableLocalLogin = model.enableLocalLogin;
            //this.externalProviders = model.externalProviders;
            
        }
    }
 