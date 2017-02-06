

export interface IuserLoginInfo {
    loginProvider: string;
    providerKey: string;
    providerDisplayName: string;

}

export class UserLoginInfo 
{
    public loginProvider: string;
    public providerKey: string;
    public providerDisplayName: string;

    constructor(model: IuserLoginInfo) {
        this.loginProvider = model.loginProvider;
        this.providerKey = model.providerKey;
        this.providerDisplayName = model.providerDisplayName;
    }

}