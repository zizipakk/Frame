"use strict";
var LoginViewModel = (function () {
    function LoginViewModel(model) {
        this.enableLocalLogin = model.enableLocalLogin;
        this.externalProviders = model.externalProviders;
    }
    return LoginViewModel;
}());
exports.LoginViewModel = LoginViewModel;
