"use strict";
var RegisterViewModel = (function () {
    function RegisterViewModel(model) {
        this.email = model.email;
        this.password = model.password;
        this.confirmPassword = model.confirmPassword;
        this.isAdmin = model.isAdmin;
    }
    return RegisterViewModel;
}());
exports.RegisterViewModel = RegisterViewModel;
