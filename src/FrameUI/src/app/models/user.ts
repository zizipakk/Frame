
export interface IloginInputModel {
    email: string,
    password: string,
    rememberLogin: boolean,
    
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
