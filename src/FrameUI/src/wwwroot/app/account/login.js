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
import { LoginInputModel } from '../models/user';
import { MembershipService } from '../services/membershipService';
import { NotificationService } from '../services/notificationService';
export var Login = (function () {
    function Login(router, membershipService, notificationService) {
        this.router = router;
        this.membershipService = membershipService;
        this.notificationService = notificationService;
        /** primeng show/hide prop */
        this.display = false;
        this.user = new LoginInputModel({ email: '', password: '', rememberLogin: false });
    }
    /** ng event */
    Login.prototype.ngAfterViewInit = function () {
        this.display = true;
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
        this.membershipService.login(this.user)
            .subscribe(function (res) {
            _this.membershipService.loginCallback(res);
            _this.notificationService.printSuccessNotification(new Array('Welcome back ' + _this.user.email + '!'));
            _this.navigateBack();
        }, function (error) {
            _this.membershipService.resetAuthorizationData();
            _this.message.push({ severity: 'error', summary: 'Error Message', detail: error });
        }, function () { });
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
//# sourceMappingURL=C:/Frame/Frame/src/FrameUI/src/app/account/login.js.map