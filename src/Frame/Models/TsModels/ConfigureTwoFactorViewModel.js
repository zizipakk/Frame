"use strict";
var ConfigureTwoFactorViewModel = (function () {
    function ConfigureTwoFactorViewModel(model) {
        this.selectedProvider = model.selectedProvider;
        this.providers = model.providers;
    }
    return ConfigureTwoFactorViewModel;
}());
exports.ConfigureTwoFactorViewModel = ConfigureTwoFactorViewModel;
