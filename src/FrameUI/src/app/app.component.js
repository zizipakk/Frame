"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var AppComponent = (function () {
    function AppComponent(membershipService, router) {
        this.membershipService = membershipService;
        this.router = router;
    }
    AppComponent.prototype.ngOnInit = function () {
        this.menuItems =
            [{
                    label: 'Home',
                    icon: '',
                    routerLink: ['/'],
                    command: function (event) { },
                    items: null
                }];
        if (!this.isUserLoggedIn()) {
            this.menuItems.push({
                label: 'Log In',
                icon: 'fa-unlock-alt fa-fw',
                routerLink: ['/account/login'],
                command: function (event) { },
                items: null
            });
        }
        else {
            this.menuItems.push({
                label: '{{getUserName()}}',
                icon: 'fa-user',
                routerLink: null,
                command: function (event) { },
                items: [
                    { label: ' Profile', icon: 'fa-fw fa-user', routerLink: null, command: function (event) { } },
                    { label: ' Inbox', icon: 'fa-fw fa-envelop', routerLink: null, command: function (event) { } },
                    { label: ' Settings', icon: 'fa-fw fa-gear', routerLink: null, command: function (event) { } }
                ]
            });
        }
        this.navigateBack();
    };
    AppComponent.prototype.navigateBack = function () {
        this.router.navigate(['/']);
    };
    AppComponent.prototype.isUserLoggedIn = function () {
        return this.membershipService.IsAuthorized;
    };
    AppComponent.prototype.getUserName = function () {
        if (this.isUserLoggedIn()) {
            return this.membershipService.UserName;
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
        core_1.Component({
            selector: 'app-root',
            templateUrl: './app.component.html',
            styleUrls: ['./app.component.css']
        })
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
