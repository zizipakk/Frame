"use strict";
var ChangePasswordViewModel = (function () {
    function ChangePasswordViewModel(model) {
        this.oldPassword = model.oldPassword;
        this.newPassword = model.newPassword;
        this.confirmPassword = model.confirmPassword;
    }
    return ChangePasswordViewModel;
}());
exports.ChangePasswordViewModel = ChangePasswordViewModel;
