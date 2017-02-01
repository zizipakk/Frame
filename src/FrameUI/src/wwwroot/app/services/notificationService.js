var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { ActionTypes } from '../reducers/reducer.settings';
export var NotificationService = (function () {
    function NotificationService(store) {
        this.store = store;
    }
    NotificationService.prototype.printSuccessMessage = function (messages) {
        var payload = [];
        messages.forEach(function (f) { return payload.push({ severity: 'success', summary: 'Success Message', detail: f }); });
        this.store.dispatch({ type: ActionTypes.SET_Message, payload: payload });
    };
    NotificationService.prototype.printInfoMessage = function (messages) {
        var payload = [];
        messages.forEach(function (f) { return payload.push({ severity: 'info', summary: 'Info Message', detail: f }); });
        this.store.dispatch({ type: ActionTypes.SET_Message, payload: payload });
    };
    NotificationService.prototype.printWarningMessage = function (messages) {
        var payload = [];
        messages.forEach(function (f) { return payload.push({ severity: 'warn', summary: 'Warning Message', detail: f }); });
        this.store.dispatch({ type: ActionTypes.SET_Message, payload: payload });
    };
    NotificationService.prototype.printErrorMessage = function (messages) {
        var payload = [];
        messages.forEach(function (f) { return payload.push({ severity: 'error', summary: 'Error Message', detail: f }); });
        this.store.dispatch({ type: ActionTypes.SET_Message, payload: payload });
    };
    NotificationService.prototype.printSuccessNotification = function (messages) {
        var payload = [];
        messages.forEach(function (f) { return payload.push({ severity: 'success', summary: 'Success Message', detail: f }); });
        this.store.dispatch({ type: ActionTypes.SET_Notification, payload: payload });
    };
    NotificationService.prototype.printInfoNotification = function (messages) {
        var payload = [];
        messages.forEach(function (f) { return payload.push({ severity: 'info', summary: 'Info Message', detail: f }); });
        this.store.dispatch({ type: ActionTypes.SET_Notification, payload: payload });
    };
    NotificationService.prototype.printWarningNotification = function (messages) {
        var payload = [];
        messages.forEach(function (f) { return payload.push({ severity: 'warn', summary: 'Warning Message', detail: f }); });
        this.store.dispatch({ type: ActionTypes.SET_Notification, payload: payload });
    };
    NotificationService.prototype.printErrorNotification = function (messages) {
        var payload = [];
        messages.forEach(function (f) { return payload.push({ severity: 'error', summary: 'Error Message', detail: f }); });
        this.store.dispatch({ type: ActionTypes.SET_Notification, payload: payload });
    };
    NotificationService = __decorate([
        Injectable(), 
        __metadata('design:paramtypes', [Store])
    ], NotificationService);
    return NotificationService;
}());
//# sourceMappingURL=C:/Frame/Frame/src/FrameUI/src/app/services/notificationService.js.map