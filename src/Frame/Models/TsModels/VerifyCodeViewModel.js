"use strict";
var VerifyCodeViewModel = (function () {
    function VerifyCodeViewModel(model) {
        this.provider = model.provider;
        this.code = model.code;
        this.returnUrl = model.returnUrl;
        this.rememberBrowser = model.rememberBrowser;
        this.rememberMe = model.rememberMe;
    }
    return VerifyCodeViewModel;
}());
exports.VerifyCodeViewModel = VerifyCodeViewModel;
