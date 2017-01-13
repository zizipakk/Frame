"use strict";
var SetPasswordViewModel = (function () {
    function SetPasswordViewModel(model) {
        this.newPassword = model.newPassword;
        this.confirmPassword = model.confirmPassword;
    }
    return SetPasswordViewModel;
}());
exports.SetPasswordViewModel = SetPasswordViewModel;
