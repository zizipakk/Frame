

export interface IregisterViewModel {
    email: string;
    password: string;
    confirmPassword: string;
    isAdmin: boolean;
    
}

export class RegisterViewModel {
    public email: string;
    public password: string;
    public confirmPassword: string;
    public isAdmin: boolean;
    
    constructor(model: IregisterViewModel) {
        this.email = model.email;
        this.password = model.password;
        this.confirmPassword = model.confirmPassword;
        this.isAdmin = model.isAdmin;
        
    }
}
 