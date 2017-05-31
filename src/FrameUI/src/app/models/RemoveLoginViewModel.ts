
export interface IremoveLoginViewModel {
    loginProvider: string;
    providerKey: string;
    
}

export class RemoveLoginViewModel implements IremoveLoginViewModel {
    public loginProvider: string;
    
    public providerKey: string;
    
    constructor(model?: IremoveLoginViewModel) {
        if(model) {
            this.loginProvider = model.loginProvider;
            this.providerKey = model.providerKey;
            
        }
    }
}
 