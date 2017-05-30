import * as def from 'class-validator';
import * as cust from '../decorators/validators';

export interface IverifyCodeViewModel {
    provider: string;
    code: string;
    returnUrl: string;
    rememberBrowser: boolean;
    rememberMe: boolean;
    
}

export class VerifyCodeViewModel implements IverifyCodeViewModel {
	@cust.Required()
    public provider: string;
    
	@cust.Required()
    public code: string;
    
    public returnUrl: string;
    
    public rememberBrowser: boolean;
    
    public rememberMe: boolean;
    
    constructor(model?: IverifyCodeViewModel) {
        if(model) {
            this.provider = model.provider;
            this.code = model.code;
            this.returnUrl = model.returnUrl;
            this.rememberBrowser = model.rememberBrowser;
            this.rememberMe = model.rememberMe;
            
        }
    }
}
 