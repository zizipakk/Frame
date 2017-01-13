"use strict";
var ConfigureTwoFactorViewModel = (function () {
    //public providers: SelectListItem[];
    function ConfigureTwoFactorViewModel(model) {
        this.selectedProvider = model.selectedProvider;
        //this.providers = model.providers;
    }
    return ConfigureTwoFactorViewModel;
}());
exports.ConfigureTwoFactorViewModel = ConfigureTwoFactorViewModel;
