export var OpenIdConnectRequest = (function () {
    function OpenIdConnectRequest(model) {
        if (model) {
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
    return OpenIdConnectRequest;
}());
//# sourceMappingURL=C:/Frame/Frame/src/FrameUI/src/app/models/openIdConnectRequest.js.map