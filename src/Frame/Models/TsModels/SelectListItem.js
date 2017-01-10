"use strict";
var SelectListItem = (function () {
    function SelectListItem(model) {
        this.disabled = model.disabled;
        this.group = model.group;
        this.selected = model.selected;
        this.text = model.text;
        this.value = model.value;
    }
    return SelectListItem;
}());
exports.SelectListItem = SelectListItem;
