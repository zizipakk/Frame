"use strict";
var ErrorMessage = (function () {
    function ErrorMessage(model) {
        this.displayMode = model.displayMode;
        this.error = model.error;
        this.requestId = model.requestId;
        this.uiLocales = model.uiLocales;
    }
    return ErrorMessage;
}());
exports.ErrorMessage = ErrorMessage;