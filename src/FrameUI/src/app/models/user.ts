
export interface IloginInputModel {
    email: string,
    password: string,
    rememberLogin: boolean
    
}

export class LoginInputModel {
    public email: string;
    public password: string;
    public rememberLogin: boolean;
    
    constructor(model: IloginInputModel) {
        this.email = model.email;
        this.password = model.password;
        this.rememberLogin = model.rememberLogin;

    }
}

export interface IuserModel {
    userName: string,
    isAuthorized: boolean,
    hasAdminRole: boolean
    
}

export class UserModel {
    public userName: string;
    public isAuthorized: boolean;
    public hasAdminRole: boolean;
    
    constructor(model: IuserModel) {
        this.userName = model.userName;
        this.isAuthorized = model.isAuthorized;
        this.hasAdminRole = model.hasAdminRole;

    }
}