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
import { User } from '../models/user';
import { OperationResult } from '../models/operationResult';
import { MembershipService } from '../services/membershipService';
import { NotificationService } from '../services/notificationService';
export var Login = (function () {
    function Login(router, membershipService, notificationService) {
        this.router = router;
        this.membershipService = membershipService;
        this.notificationService = notificationService;
        /** primeng show/hide prop */
        this.display = false;
        this.user = new User('', '');
    }
    /** ng event */
    Login.prototype.ngAfterViewInit = function () {
        this.display = true;
    };
    /** primeng event */
    Login.prototype.onAfterHide = function (event) {
        this.navigateBack();
    };
    /** custom events */
    Login.prototype.onClose = function () {
        this.display = false;
        this.navigateBack();
    };
    Login.prototype.navigateBack = function () {
        this.router.navigate(['/']);
    };
    Login.prototype.login = function () {
        var _this = this;
        var authenticationResult = new OperationResult(false, '');
        this.membershipService.login(this.user)
            .subscribe(function (res) {
            authenticationResult.Succeeded = res.Succeeded;
            authenticationResult.Message = res.Message;
        }, function (error) {
            console.error('Error: ' + error);
            _this.notificationService.handleError(error, _this.membershipService.resetAuthorizationData);
        }, function () {
            _this.membershipService.loginCallback();
            if (authenticationResult.Succeeded) {
                _this.notificationService.printSuccessMessage('Welcome back ' + _this.user.Username + '!');
                _this.router.navigateByUrl('/');
            }
            else {
                _this.notificationService.printErrorMessage(authenticationResult.Message);
            }
        });
    };
    ;
    Login = __decorate([
        Component({
            selector: 'login-modal',
            templateUrl: 'login.html',
        }), 
        __metadata('design:paramtypes', [Router, MembershipService, NotificationService])
    ], Login);
    return Login;
}());
//# sourceMappingURL=C:/FRAME/Frame/src/FrameUI/src/app/account/login.js.map