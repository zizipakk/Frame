"use strict";
var AuthenticationDescription = (function () {
    function AuthenticationDescription(model) {
        this.authenticationScheme = model.authenticationScheme;
        this.displayName = model.displayName;
        this.items = model.items;
    }
    return AuthenticationDescription;
}());
exports.AuthenticationDescription = AuthenticationDescription;
