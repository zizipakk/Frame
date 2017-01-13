"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var NotificationService = (function () {
    function NotificationService() {
        this.notifier = alertify;
    }
    NotificationService.prototype.printSuccessMessage = function (message) {
        this.notifier.success(message);
    };
    NotificationService.prototype.printErrorMessage = function (message) {
        this.notifier.error(message);
    };
    NotificationService.prototype.printConfirmationDialog = function (message, okCallback) {
        this.notifier.confirm(message, function (e) {
            if (e) {
                okCallback();
            }
            else {
            }
        });
    };
    NotificationService.prototype.handleError = function (error, callback) {
        console.log(error);
        if (error.status == 403) {
            this.printErrorMessage('Forbidden');
        }
        else if (error.status == 401) {
            if (callback) {
                callback();
            }
            this.printErrorMessage('Unauthorized');
        }
    };
    NotificationService = __decorate([
        core_1.Injectable()
    ], NotificationService);
    return NotificationService;
}());
exports.NotificationService = NotificationService;
