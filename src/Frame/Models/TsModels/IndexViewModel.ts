

    export interface IindexViewModel {
        hasPassword: boolean;
        logins: UserLoginInfo[];
        phoneNumber: string;
        twoFactor: boolean;
        browserRemembered: boolean;
        
    }

    export class IndexViewModel {
        public hasPassword: boolean;
        public logins: UserLoginInfo[];
        public phoneNumber: string;
        public twoFactor: boolean;
        public browserRemembered: boolean;
        
        constructor(model: IindexViewModel) {
            this.hasPassword = model.hasPassword;
            this.logins = model.logins;
            this.phoneNumber = model.phoneNumber;
            this.twoFactor = model.twoFactor;
            this.browserRemembered = model.browserRemembered;
            
        }
    }
 