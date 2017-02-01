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
import { Store } from '@ngrx/store';
import { ActionTypes } from './reducers/reducer.settings';
import { UserModel } from './models/user';
import { MembershipService } from './services/membershipService';
import { NotificationService } from './services/notificationService';
export var AppComponent = (function () {
    function AppComponent(store, membershipService, notificationService, router) {
        this.store = store;
        this.membershipService = membershipService;
        this.notificationService = notificationService;
        this.router = router;
        this.user = new UserModel({
            isAuthorized: this.membershipService.retrieve("IsAuthorized"),
            hasAdminRole: this.membershipService.retrieve("HasAdminRole"),
            userName: this.membershipService.retrieve("UserName")
        });
        this.subscriptions = new Array();
    }
    AppComponent.prototype.ngOnInit = function () {
        var _this = this;
        // Init from local store
        this.store.dispatch({ type: ActionTypes.SET_User, payload: this.user });
        this.subscriptions.push(this.store.select(function (s) { return s.UserReducer; }).subscribe(function (user) {
            _this.user = user;
            _this.menuItems = _this.refreshMenu();
        }));
        this.subscriptions.push(this.store.select(function (s) { return s.NotificationReducer; }).subscribe(function (notification) {
            _this.notification = notification;
        }));
        this.subscriptions.push(this.store.select(function (s) { return s.MessageReducer; }).subscribe(function (message) {
            _this.message = message;
        }));
    };
    AppComponent.prototype.ngOnDestroy = function () {
        this.subscriptions.forEach(function (sub) { return sub.unsubscribe(); });
    };
    AppComponent.prototype.isUserLoggedIn = function () {
        return this.user.isAuthorized;
    };
    AppComponent.prototype.refreshMenu = function () {
        var _this = this;
        var menuItems = [{
                label: 'Home',
                icon: '',
                routerLink: ['/'],
                command: function (event) { },
                items: null
            }];
        if (!this.isUserLoggedIn()) {
            menuItems.push({
                label: 'Log In',
                icon: 'fa-unlock-alt fa-fw',
                routerLink: ['/account/login'],
                command: function (event) { },
                items: null
            });
        }
        else {
            menuItems.push({
                label: this.user.userName,
                icon: 'fa-user',
                routerLink: null,
                command: function (event) { },
                items: [
                    { label: ' Profile', icon: 'fa-fw fa-user', routerLink: null, command: function (event) { } },
                    { label: ' Inbox', icon: 'fa-fw fa-envelope', routerLink: null, command: function (event) { } },
                    { label: ' Settings', icon: 'fa-fw fa-gear', routerLink: null, command: function (event) { } },
                    { label: ' Log Out', icon: 'fa-fw fa-lock', routerLink: null, command: function (event) { _this.logOut(); } }
                ]
            });
        }
        return menuItems;
    };
    AppComponent.prototype.logOut = function () {
        var _this = this;
        this.membershipService.logout()
            .subscribe(function () {
            _this.membershipService.logoutCallback();
            _this.notificationService.printSuccessNotification(new Array('By ' + _this.user.userName + '!'));
        }, function (error) {
            _this.membershipService.resetAuthorizationData();
            _this.notificationService.printErrorNotification(error);
        }, function () { });
    };
    AppComponent = __decorate([
        Component({
            selector: 'app-root',
            templateUrl: './app.component.html',
            styleUrls: ['./app.component.css']
        }), 
        __metadata('design:paramtypes', [Store, MembershipService, NotificationService, Router])
    ], AppComponent);
    return AppComponent;
}());
//# sourceMappingURL=C:/Frame/Frame/src/FrameUI/src/app/app.component.js.map