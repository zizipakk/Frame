

export interface IverifyCodeViewModel {
    provider: string;
    code: string;
    returnUrl: string;
    rememberBrowser: boolean;
    rememberMe: boolean;
    
}

export class VerifyCodeViewModel {
    public provider: string;
    public code: string;
    public returnUrl: string;
    public rememberBrowser: boolean;
    public rememberMe: boolean;
    
    constructor(model: IverifyCodeViewModel) {
        this.provider = model.provider;
        this.code = model.code;
        this.returnUrl = model.returnUrl;
        this.rememberBrowser = model.rememberBrowser;
        this.rememberMe = model.rememberMe;
        
    }
}
 