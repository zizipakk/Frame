export var User = (function () {
    function User(username, password) {
        this.Email = username;
        this.Password = password;
        this.RememberLogin = false;
    }
    return User;
}());
export var LoginInputModel = (function () {
    function LoginInputModel(model) {
        this.email = model.email;
        this.password = model.password;
        this.rememberLogin = model.rememberLogin;
        this.returnUrl = model.returnUrl;
    }
    return LoginInputModel;
}());
//# sourceMappingURL=C:/FRAME/Frame/src/FrameUI/src/app/models/user.js.map