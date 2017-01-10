"use strict";
var ExternalProvider = (function () {
    function ExternalProvider() {
    }
    return ExternalProvider;
}());
exports.ExternalProvider = ExternalProvider;
var LoginViewModel = (function () {
    function LoginViewModel(model) {
        this.enableLocalLogin = model.enableLocalLogin;
        this.externalProviders = model.externalProviders;
    }
    return LoginViewModel;
}());
exports.LoginViewModel = LoginViewModel;
