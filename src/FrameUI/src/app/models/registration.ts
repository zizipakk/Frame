export interface Iregistration {
    //username: string;
    password: string;
    email: string;
    confirmPassword: string;
}


export class Registration implements Iregistration {
    //public username: string;
    public password: string;
    public email: string;
    public confirmPassword: string;

    constructor(model?: Iregistration) {
        if (model) {
            //this.username = model.username;
            this.password = model.password;
            this.email = model.email;
            this.confirmPassword = model.confirmPassword;
        } else {
            //this.username = '';
            this.password = '';
            this.email = '';
            this.confirmPassword = '';
        }
    }
}
