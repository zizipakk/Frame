export var ConsentViewModel = (function () {
    function ConsentViewModel(model) {
        this.clientName = model.clientName;
        this.clientUrl = model.clientUrl;
        this.clientLogoUrl = model.clientLogoUrl;
        this.allowRememberConsent = model.allowRememberConsent;
        this.identityScopes = model.identityScopes;
        this.resourceScopes = model.resourceScopes;
    }
    return ConsentViewModel;
}());
export var ScopeViewModel = (function () {
    function ScopeViewModel(model) {
        this.name = model.name;
        this.displayName = model.displayName;
        this.description = model.description;
        this.emphasize = model.emphasize;
        this.required = model.required;
        this.checked = model.checked;
    }
    return ScopeViewModel;
}());
//# sourceMappingURL=C:/FRAME/Frame/src/FrameUI/src/app/models/ConsentViewModel.js.map