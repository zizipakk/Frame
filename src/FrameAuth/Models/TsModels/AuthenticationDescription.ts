export interface IauthenticationDescription {
    authenticationScheme: string;
    displayName: string;
    items: { [id: string]: any; };

}

export class AuthenticationDescription {    
    public authenticationScheme: string;
    public displayName: string;
    public items: { [id: string]: any; };

    constructor(model: IauthenticationDescription) {
        this.authenticationScheme = model.authenticationScheme;
        this.displayName = model.displayName;
        this.items = model.items;
    }
}