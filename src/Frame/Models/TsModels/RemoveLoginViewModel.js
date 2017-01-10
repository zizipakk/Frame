"use strict";
var RemoveLoginViewModel = (function () {
    function RemoveLoginViewModel(model) {
        this.loginProvider = model.loginProvider;
        this.providerKey = model.providerKey;
    }
    return RemoveLoginViewModel;
}());
exports.RemoveLoginViewModel = RemoveLoginViewModel;
