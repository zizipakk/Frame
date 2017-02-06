"use strict";
var ResetPasswordViewModel = (function () {
    function ResetPasswordViewModel(model) {
        this.email = model.email;
        this.password = model.password;
        this.confirmPassword = model.confirmPassword;
        this.code = model.code;
    }
    return ResetPasswordViewModel;
}());
exports.ResetPasswordViewModel = ResetPasswordViewModel;
