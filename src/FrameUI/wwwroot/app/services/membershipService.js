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
var dataService_1 = require('./dataService');
var user_1 = require('../models/user');
//A class to manage user authentication
//uses local storage to save user authentication cookies
var MembershipService = (function () {
    //inject data service
    function MembershipService(accountService) {
        this.accountService = accountService;
        this.accountRegisterAPI = 'api/account/register/';
        this.accountLoginAPI = 'api/account/authenticate/';
        this.accountLogoutAPI = 'api/account/logout/';
    }
    MembershipService.prototype.register = function (newUser) {
        this.accountService.set(this.accountRegisterAPI);
        return this.accountService.post(JSON.stringify(newUser));
    };
    MembershipService.prototype.login = function (creds) {
        this.accountService.set(this.accountLoginAPI);
        return this.accountService.post(JSON.stringify(creds));
    };
    MembershipService.prototype.logout = function () {
        this.accountService.set(this.accountLogoutAPI);
        return this.accountService.post(null, false);
    };
    MembershipService.prototype.isUserAuthenticated = function () {
        //var user: User = localStorage.getItem('user');
        var user = localStorage.getItem('user');
        if (user != null)
            return true;
        else
            return false;
    };
    MembershipService.prototype.getLoggedInUser = function () {
        var user;
        if (this.isUserAuthenticated()) {
            var userData = JSON.parse(localStorage.getItem('user'));
            user = new user_1.User(userData.Username, userData.Password);
        }
        return user;
    };
    MembershipService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [dataService_1.DataService])
    ], MembershipService);
    return MembershipService;
}());
exports.MembershipService = MembershipService;
