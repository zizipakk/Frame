export var SignInResult = (function () {
    function SignInResult(model) {
        this.access_token = model.access_token;
        this.expires_in = model.expires_in;
        this.id_token = model.id_token;
        this.token_type = model.token_type;
    }
    return SignInResult;
}());
//# sourceMappingURL=C:/Frame/Frame/src/FrameUI/src/app/models/signInResult.js.map