export interface IopenIdConnectRequest {
        //     Gets or sets the "access_token" parameter.
        accesstoken: string;
        //     Gets or sets the "assertion" parameter.
        assertion: string;
        //     Gets or sets the "client_assertion" parameter.
        clientassertion: string;
        //     Gets or sets the "client_assertion_type" parameter.
        clientassertiontype: string;
        //     Gets or sets the "client_id" parameter.
        client_id: string;
        //     Gets or sets the "client_secret" parameter.
        clientsecret: string;
        //     Gets or sets the "code" parameter.
        code: string;
        //     Gets or sets the "code_challenge" parameter.
        codechallenge: string;
        //     Gets or sets the "code_challenge_method" parameter.
        codechallengemethod: string;
        //     Gets or sets the "code_verifier" parameter.
        codeverifier: string;
        //     Gets or sets the "grant_type" parameter.
        grant_type: string;
        //     Gets or sets the "id_token_hint" parameter.
        idtokenhint: string;
        //     Gets or sets the "nonce" parameter.
        nonce: string;
        //     Gets or sets the "password" parameter.
        password: string;
        //     Gets or sets the "post_logout_redirect_uri" parameter.
        postlogoutredirecturi: string;
        //     Gets or sets the "prompt" parameter.
        prompt: string;
        //     Gets or sets the "redirect_uri" parameter.
        redirecturi: string;
        //     Gets or sets the "refresh_token" parameter.
        refreshtoken: string;
        //     Gets or sets the "request" parameter.
        request: string;
        //     Gets or sets the "request_id" parameter.
        requestid: string;
        //     Gets or sets the "request_uri" parameter.
        requesturi: string;
        //     Gets or sets the "resource" parameter.
        resource: string;
        //     Gets or sets the "response_mode" parameter.
        responsemode: string;
        //     Gets or sets the "response_type" parameter.
        responsetype: string;
        //     Gets or sets the "scope" parameter.
        scope: string;
        //     Gets or sets the "state" parameter.
        state: string;
        //     Gets or sets the "token" parameter.
        token: string;
        //     Gets or sets the "token_type_hint" parameter.
        tokentypehint: string;
        //     Gets or sets the "username" parameter.
        username: string;

}

export class OpenIdConnectRequest implements IopenIdConnectRequest {
        //     Gets or sets the "access_token" parameter.
        public accesstoken: string;
        //     Gets or sets the "assertion" parameter.
        public assertion: string;
        //     Gets or sets the "client_assertion" parameter.
        public clientassertion: string;
        //     Gets or sets the "client_assertion_type" parameter.
        public clientassertiontype: string;
        //     Gets or sets the "client_id" parameter.
        public client_id: string;
        //     Gets or sets the "client_secret" parameter.
        public clientsecret: string;
        //     Gets or sets the "code" parameter.
        public code: string;
        //     Gets or sets the "code_challenge" parameter.
        public codechallenge: string;
        //     Gets or sets the "code_challenge_method" parameter.
        public codechallengemethod: string;
        //     Gets or sets the "code_verifier" parameter.
        public codeverifier: string;
        //     Gets or sets the "grant_type" parameter.
        public grant_type: string;
        //     Gets or sets the "id_token_hint" parameter.
        public idtokenhint: string;
        //     Gets or sets the "nonce" parameter.
        public nonce: string;
        //     Gets or sets the "password" parameter.
        public password: string;
        //     Gets or sets the "post_logout_redirect_uri" parameter.
        public postlogoutredirecturi: string;
        //     Gets or sets the "prompt" parameter.
        public prompt: string;
        //     Gets or sets the "redirect_uri" parameter.
        public redirecturi: string;
        //     Gets or sets the "refresh_token" parameter.
        public refreshtoken: string;
        //     Gets or sets the "request" parameter.
        public request: string;
        //     Gets or sets the "request_id" parameter.
        public requestid: string;
        //     Gets or sets the "request_uri" parameter.
        public requesturi: string;
        //     Gets or sets the "resource" parameter.
        public resource: string;
        //     Gets or sets the "response_mode" parameter.
        public responsemode: string;
        //     Gets or sets the "response_type" parameter.
        public responsetype: string;
        //     Gets or sets the "scope" parameter.
        public scope: string;
        //     Gets or sets the "state" parameter.
        public state: string;
        //     Gets or sets the "token" parameter.
        public token: string;
        //     Gets or sets the "token_type_hint" parameter.
        public tokentypehint: string;
        //     Gets or sets the "username" parameter.
        public username: string;

    constructor(model?: IopenIdConnectRequest) {
        if (model)
        {
            this.accesstoken = model.accesstoken;
            this.assertion = model.assertion;
            this.clientassertion = model.clientassertion;
            this.clientassertiontype = model.clientassertiontype;
            this.client_id = model.client_id;
            this.clientsecret = model.clientsecret;
            this.code = model.code;
            this.codechallenge = model.codechallenge;
            this.codechallengemethod = model.codechallengemethod;
            this.codeverifier = model.codeverifier;
            this.grant_type = model.grant_type;
            this.idtokenhint = model.idtokenhint;
            this.nonce = model.nonce;
            this.password = model.password;
            this.postlogoutredirecturi = model.postlogoutredirecturi;
            this.prompt = model.prompt;
            this.redirecturi = model.redirecturi;
            this.refreshtoken = model.refreshtoken;
            this.request = model.request;
            this.requestid = model.requestid;
            this.requesturi = model.requesturi;
            this.resource = model.resource;
            this.responsemode = model.responsemode;
            this.responsetype = model.responsetype;
            this.scope = model.scope;
            this.state = model.state;
            this.token = model.token;
            this.tokentypehint = model.tokentypehint;
            this.username = model.username;
        }
    }
}
