"use strict";
var SendCodeViewModel = (function () {
    function SendCodeViewModel(model) {
        this.selectedProvider = model.selectedProvider;
        this.providers = model.providers;
        this.returnUrl = model.returnUrl;
        this.rememberMe = model.rememberMe;
    }
    return SendCodeViewModel;
}());
exports.SendCodeViewModel = SendCodeViewModel;
