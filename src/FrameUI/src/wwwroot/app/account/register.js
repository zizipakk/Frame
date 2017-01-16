var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Registration } from '../models/registration';
import { OperationResult } from '../models/operationResult';
import { MembershipService } from '../services/membershipService';
import { NotificationService } from '../services/notificationService';
export var Register = (function () {
    function Register(membershipService, notificationService, router) {
        this.membershipService = membershipService;
        this.notificationService = notificationService;
        this.router = router;
        /** primeng show/hide prop */
        this.display = false;
        this.newUser = new Registration('', '', '');
    }
    /** ng event */
    Register.prototype.ngAfterViewInit = function () {
        this.display = true;
    };
    /** primeng event */
    Register.prototype.onAfterHide = function (event) {
        this.navigateBack();
    };
    /** custom events */
    Register.prototype.onClose = function () {
        this.display = false;
        this.navigateBack();
    };
    Register.prototype.navigateBack = function () {
        this.router.navigate(['/account/login']);
    };
    Register.prototype.register = function () {
        var _this = this;
        var registrationResult = new OperationResult(false, '');
        this.membershipService.register(this.newUser)
            .subscribe(function (res) {
            registrationResult.Succeeded = res.Succeeded;
            registrationResult.Message = res.Message;
        }, function (error) { return console.error('Error: ' + error); }, function () {
            if (registrationResult.Succeeded) {
                _this.notificationService.printSuccessMessage('Dear ' + _this.newUser.Username + ', please login with your credentials');
                _this.router.navigate(['/account/login']);
            }
            else {
                _this.notificationService.printErrorMessage(registrationResult.Message);
            }
        });
    };
    ;
    Register = __decorate([
        Component({
            selector: 'register-modal',
            templateUrl: 'register.html',
        }), 
        __metadata('design:paramtypes', [MembershipService, NotificationService, Router])
    ], Register);
    return Register;
}());
//# sourceMappingURL=C:/FRAME/Frame/src/FrameUI/src/app/account/register.js.map