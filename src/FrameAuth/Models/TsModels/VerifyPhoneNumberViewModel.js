"use strict";
var VerifyPhoneNumberViewModel = (function () {
    function VerifyPhoneNumberViewModel(model) {
        this.code = model.code;
        this.phoneNumber = model.phoneNumber;
    }
    return VerifyPhoneNumberViewModel;
}());
exports.VerifyPhoneNumberViewModel = VerifyPhoneNumberViewModel;
