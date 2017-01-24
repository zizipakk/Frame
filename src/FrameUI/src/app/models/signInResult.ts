
export interface IsignInResult {
    access_token: string;
    expires_in: number;
    id_token: string;
    token_type: string;
    
}

export class SignInResult {
    public access_token: string;
    public expires_in: number;
    public id_token: string;
    public token_type: string;
    
    constructor(model: IsignInResult) {
        this.access_token = model.access_token;
        this.expires_in = model.expires_in;
        this.id_token = model.id_token;
        this.token_type = model.token_type;

    }
}
