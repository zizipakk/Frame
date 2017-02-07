export interface Iregistration {
    username: string;
    password: string;
    email: string;
}


export class Registration implements Iregistration {
    public username: string;
    public password: string;
    public email: string;

    constructor(model?: Iregistration) {
        if (model) {
            this.username = model.username;
            this.password = model.password;
            this.email = model.email;
        } else {
            this.username = '';
            this.password = '';
            this.email = '';
        }
    }
}
