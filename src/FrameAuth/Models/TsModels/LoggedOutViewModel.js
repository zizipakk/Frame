"use strict";
var LoggedOutViewModel = (function () {
    function LoggedOutViewModel(model) {
        this.postLogoutRedirectUri = model.postLogoutRedirectUri;
        this.clientName = model.clientName;
        this.signOutIframeUrl = model.signOutIframeUrl;
    }
    return LoggedOutViewModel;
}());
exports.LoggedOutViewModel = LoggedOutViewModel;
