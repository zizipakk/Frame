"use strict";
var IndexViewModel = (function () {
    function IndexViewModel(model) {
        this.hasPassword = model.hasPassword;
        this.logins = model.logins;
        this.phoneNumber = model.phoneNumber;
        this.twoFactor = model.twoFactor;
        this.browserRemembered = model.browserRemembered;
    }
    return IndexViewModel;
}());
exports.IndexViewModel = IndexViewModel;
