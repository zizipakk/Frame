"use strict";
var protractor_1 = require('protractor');
var FrameUiPage = (function () {
    function FrameUiPage() {
    }
    FrameUiPage.prototype.navigateTo = function () {
        return protractor_1.browser.get('/');
    };
    FrameUiPage.prototype.getParagraphText = function () {
        return protractor_1.element(protractor_1.by.css('app-root h1')).getText();
    };
    return FrameUiPage;
}());
exports.FrameUiPage = FrameUiPage;
//# sourceMappingURL=app.po.js.map