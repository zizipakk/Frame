export var LoginInputModel = (function () {
    function LoginInputModel(model) {
        this.email = model.email;
        this.password = model.password;
        this.rememberLogin = model.rememberLogin;
    }
    return LoginInputModel;
}());
export var UserModel = (function () {
    function UserModel(model) {
        this.userName = model.userName;
        this.isAuthorized = model.isAuthorized;
        this.hasAdminRole = model.hasAdminRole;
    }
    return UserModel;
}());
//# sourceMappingURL=C:/Frame/Frame/src/FrameUI/src/app/models/user.js.map