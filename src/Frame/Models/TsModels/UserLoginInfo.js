"use strict";
var UserLoginInfo = (function () {
    function UserLoginInfo(model) {
        this.loginProvider = model.loginProvider;
        this.providerKey = model.providerKey;
        this.providerDisplayName = model.providerDisplayName;
    }
    return UserLoginInfo;
}());
exports.UserLoginInfo = UserLoginInfo;
