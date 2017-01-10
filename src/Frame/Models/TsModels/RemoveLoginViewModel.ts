

export interface IremoveLoginViewModel {
    loginProvider: string;
    providerKey: string;
    
}

export class RemoveLoginViewModel {
    public loginProvider: string;
    public providerKey: string;
    
    constructor(model: IremoveLoginViewModel) {
        this.loginProvider = model.loginProvider;
        this.providerKey = model.providerKey;
        
    }
}
 