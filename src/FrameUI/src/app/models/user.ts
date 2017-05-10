
export interface IloginInputModel {
    email: string,
    password: string,
    //rememberLogin: boolean
    
}

export class LoginInputModel implements IloginInputModel {
    public email: string;
    public password: string;
    //public rememberLogin: boolean;
    
    constructor(model?: IloginInputModel) {
        if (model) {
            this.email = model.email;
            this.password = model.password;
            //this.rememberLogin = model.rememberLogin;
        } else {
            this.email = '';
            this.password = '';
            //this.rememberLogin = false;
        }
    }
}

export interface IuserModel {
    userId: string,
    userName: string,
    isAuthorized: boolean,
    hasAdminRole: boolean
    
}

export class UserModel implements IuserModel {
    public userId: string;
    public userName: string;
    public isAuthorized: boolean;
    public hasAdminRole: boolean;
    
    constructor(model?: IuserModel) {
        if (model) {
            this.userId = model.userId;
            this.userName = model.userName;
            this.isAuthorized = model.isAuthorized;
            this.hasAdminRole = model.hasAdminRole;
        } else {
            this.userId = '';
            this.userName = '';
            this.isAuthorized = false;
            this.hasAdminRole = false;
        }
    }
}
