import * as def from 'class-validator';
import * as cust from '../decorators/validators';

export interface IloginInputModel {
    email: string;
    password: string;
    rememberMe: boolean;
    returnUrl: string;
    
}

export class LoginInputModel implements IloginInputModel {
	@cust.Required()
	@def.Validate(cust.IsEmail)
    public email: string;
    
	@cust.Required()
    public password: string;
    
    public rememberMe: boolean;
    
    public returnUrl: string;
    
    constructor(model?: IloginInputModel) {
        if(model) {
            this.email = model.email;
            this.password = model.password;
            this.rememberMe = model.rememberMe;
            this.returnUrl = model.returnUrl;
            
        }
    }
}

export interface IloginViewModel extends IloginInputModel {
    enableLocalLogin: boolean;
    externalProviders: ExternalProvider[];
    
}

export class LoginViewModel extends LoginInputModel implements IloginViewModel {
    public enableLocalLogin: boolean;
    
    public externalProviders: ExternalProvider[];
    
    constructor(model?: IloginViewModel) {
	super(model);

        if(model) {
            this.enableLocalLogin = model.enableLocalLogin;
            this.externalProviders = model.externalProviders;
            
        }
    }
}

export interface IexternalProvider {
    displayName: string;
    authenticationScheme: string;
    
}

export class ExternalProvider implements IexternalProvider {
    public displayName: string;
    
    public authenticationScheme: string;
    
    constructor(model?: IexternalProvider) {
        if(model) {
            this.displayName = model.displayName;
            this.authenticationScheme = model.authenticationScheme;
            
        }
    }
}
 