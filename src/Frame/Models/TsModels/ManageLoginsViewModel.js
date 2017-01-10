"use strict";
var ManageLoginsViewModel = (function () {
    function ManageLoginsViewModel(model) {
        this.currentLogins = model.currentLogins;
        this.otherLogins = model.otherLogins;
    }
    return ManageLoginsViewModel;
}());
exports.ManageLoginsViewModel = ManageLoginsViewModel;
