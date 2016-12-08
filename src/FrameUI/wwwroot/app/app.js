"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var common_1 = require('@angular/common');
require('rxjs/add/operator/map'); //
var router_1 = require('@angular/router');
var membershipService_1 = require('./services/membershipService');
var home_1 = require('./components/home'); //for routing precomp
var account_1 = require('./components/account/account'); //
var login_1 = require('./components/account/login'); //
var register_1 = require('./components/account/register'); //
var AppComponent = (function () {
    function AppComponent(membershipService, router) {
        this.membershipService = membershipService;
        this.router = router;
    }
    AppComponent.prototype.ngOnInit = function () {
        this.router.navigate(['/']);
    };
    AppComponent.prototype.isUserLoggedIn = function () {
        return this.membershipService.isUserAuthenticated();
    };
    AppComponent.prototype.getUserName = function () {
        if (this.isUserLoggedIn()) {
            var user = this.membershipService.getLoggedInUser();
            return user.Username;
        }
        else
            return 'Account';
    };
    AppComponent.prototype.logout = function () {
        this.membershipService.logout()
            .subscribe(function (res) {
            localStorage.removeItem('user');
        }, function (error) { return console.error('Error: ' + error); }, function () { });
    };
    AppComponent = __decorate([
        //
        core_1.Component({
            selector: 'frame-app',
            templateUrl: './app/app.html',
            directives: [
                router_1.ROUTER_DIRECTIVES,
                common_1.CORE_DIRECTIVES
            ],
            providers: [
                membershipService_1.MembershipService,
            ],
            precompile: [home_1.Home, account_1.Account, login_1.Login, register_1.Register]
        }), 
        __metadata('design:paramtypes', [membershipService_1.MembershipService, router_1.Router])
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.js.map