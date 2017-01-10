
export interface IexternalProvider {
    displayName: string;
    authenticationScheme: string;

}

export class ExternalProvider {
    public displayName: string;
    public authenticationScheme: string;

}

export interface IloginViewModel {
    enableLocalLogin: boolean;
    externalProviders: IexternalProvider[];
    
}

export class LoginViewModel {
    public enableLocalLogin: boolean;
    public externalProviders: IexternalProvider[];
    
    constructor(model: IloginViewModel) {
        this.enableLocalLogin = model.enableLocalLogin;
        this.externalProviders = model.externalProviders;
        
    }
}
