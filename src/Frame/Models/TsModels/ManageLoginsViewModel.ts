import { IuserLoginInfo } from './UserLoginInfo';
import { IauthenticationDescription } from './AuthenticationDescription';

export interface ImanageLoginsViewModel {
    currentLogins: IuserLoginInfo[];
    otherLogins: IauthenticationDescription[];
    
}

export class ManageLoginsViewModel {
    public currentLogins: IuserLoginInfo[];
    public otherLogins: IauthenticationDescription[];
    
    constructor(model: ImanageLoginsViewModel) {
        this.currentLogins = model.currentLogins;
        this.otherLogins = model.otherLogins;
        
    }
}
 