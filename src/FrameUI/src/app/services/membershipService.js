"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var app_settings_1 = require('../app.settings');
//A class to manage user authentication
//uses local storage to save user authentication cookies
var MembershipService = (function () {
    function MembershipService(dataService) {
        this.dataService = dataService;
        this.action = '/account';
        this.accountRegisterAPI = app_settings_1.API.AUTH + this.action + '/register';
        this.accountInfoAPI = app_settings_1.API.AUTH + this.action + '/info';
        this.accountLoginAPI = app_settings_1.API.AUTH + this.action + '/login';
        this.accountLogoutAPI = app_settings_1.API.AUTH + this.action + '/logout';
        this.storage = sessionStorage; //localStorage;
        if (this.retrieve("IsAuthorized") !== "") {
            this.HasAdminRole = this.retrieve("HasAdminRole");
            this.IsAuthorized = this.retrieve("IsAuthorized");
        }
    }
    /** Read store */
    MembershipService.prototype.retrieve = function (key) {
        var item = this.storage.getItem(key);
        if (item && item !== 'undefined') {
            return JSON.parse(item);
        }
        return;
    };
    /** Write store */
    MembershipService.prototype.store = function (key, value) {
        this.storage.setItem(key, JSON.stringify(value));
    };
    MembershipService.prototype.register = function (newUser) {
        this.dataService.set(this.accountRegisterAPI);
        return this.dataService.post(JSON.stringify(newUser));
    };
    MembershipService.prototype.login = function (creds) {
        this.resetAuthorizationData();
        // var authorizationUrl = this._configuration.Server + '/connect/authorize';
        // var client_id = 'singleapp';
        // var redirect_uri = this._configuration.Server + '/index.html';
        // var response_type = "id_token token";
        // var scope = "dataEventRecords openid";
        var nonce = "N" + Math.random() + "" + Date.now();
        var state = Date.now() + "" + Math.random();
        // this.store("authStateControl", state);
        // this.store("authNonce", nonce);
        // var url =
        //     authorizationUrl + "?" +
        //     "response_type=" + encodeURI(response_type) + "&" +
        //     "client_id=" + encodeURI(client_id) + "&" +
        //     "redirect_uri=" + encodeURI(redirect_uri) + "&" +
        //     "scope=" + encodeURI(scope) + "&" +
        //     "nonce=" + encodeURI(nonce) + "&" +
        //     "state=" + encodeURI(state);
        // window.location.href = url;
        this.dataService.set(this.accountLoginAPI);
        return this.dataService.post(JSON.stringify(creds));
    };
    MembershipService.prototype.loginCallback = function () {
        console.log("BEGIN AuthorizedCallback, no auth data");
        this.resetAuthorizationData();
        var hash = window.location.hash.substr(1);
        var result = hash.split('&').reduce(function (result, item) {
            var parts = item.split('=');
            result[parts[0]] = parts[1];
            return result;
        }, {});
        console.log(result);
        console.log("AuthorizedCallback created, begin token validation");
        var token = "";
        var id_token = "";
        var authResponseIsValid = false;
        if (!result.error) {
            if (result.state !== this.retrieve("authStateControl")) {
                console.log("AuthorizedCallback incorrect state");
            }
            else {
                token = result.access_token;
                id_token = result.id_token;
                var dataIdToken = this.getDataFromToken(id_token);
                console.log(dataIdToken);
                // validate nonce
                if (dataIdToken.nonce !== this.retrieve("authNonce")) {
                    console.log("AuthorizedCallback incorrect nonce");
                }
                else {
                    this.store("authNonce", "");
                    this.store("authStateControl", "");
                    authResponseIsValid = true;
                    console.log("SSSS:authResponseIsValid:" + authResponseIsValid);
                    console.log("AuthorizedCallback state and nonce validated, returning access token");
                }
            }
        }
        console.log("SSSS:authResponseIsValid:" + authResponseIsValid);
        if (authResponseIsValid) {
            this.setAuthorizationData(token, id_token);
        }
        else {
            this.resetAuthorizationData();
        }
    };
    MembershipService.prototype.setAuthorizationData = function (token, id_token) {
        console.log(token);
        console.log(id_token);
        console.log("storing to storage, getting the roles");
        this.store("authorizationData", token);
        this.store("authorizationDataIdToken", id_token);
        this.IsAuthorized = true;
        this.store("IsAuthorized", true);
        // this.getUserData()
        //     .subscribe(data => this.UserData = data,
        //     error => this.HandleError(error),
        //     () => {
        //         for (var i = 0; i < this.UserData.role.length; i++) {
        //             console.log("Role: " + this.UserData.role[i]);
        //             if (this.UserData.role[i] === "dataEventRecords.admin") {
        //                 this.HasAdminRole = true;
        //                 this.store("HasAdminRole", true)
        //             }
        //             if (this.UserData.role[i] === "admin") {
        //                 this.HasUserAdminRole = true;
        //                 this.store("HasUserAdminRole", true)
        //             }
        //         }
        //     });
        var data = this.getDataFromToken(id_token);
        console.log(data);
        for (var i = 0; i < data.role.length; i++) {
            console.log("Role: " + data.role[i]);
            if (data.role[i] === "admin") {
                this.HasAdminRole = true;
                this.store("HasAdminRole", true);
            }
        }
        this.UserName = data.username;
        this.store("UserName", data.username);
    };
    MembershipService.prototype.resetAuthorizationData = function () {
        this.IsAuthorized = false;
        this.HasAdminRole = false;
        this.store("authorizationData", "");
        this.store("authorizationDataIdToken", "");
        this.store("HasAdminRole", false);
        this.store("IsAuthorized", false);
        this.UserName = '';
        this.store("UserName", '');
    };
    MembershipService.prototype.logout = function () {
        this.resetAuthorizationData();
        this.dataService.set(this.accountLogoutAPI);
        return this.dataService.post(null, false);
        //TODO
        // let id_token_hint = this.retrieve("authorizationDataIdToken");
        // let post_logout_redirect_uri = this._configuration.Server + '/Unauthorized';
        // let url =
        //     authorizationUrl + "?" +
        //     "id_token_hint=" + encodeURI(id_token_hint) + "&" +
        //     "post_logout_redirect_uri=" + encodeURI(post_logout_redirect_uri);
        // window.location.href = url;
    };
    MembershipService.prototype.getUserData = function () {
        this.dataService.set(this.accountInfoAPI);
        return this.dataService.get();
    };
    MembershipService.prototype.urlBase64Decode = function (str) {
        var output = str.replace('-', '+').replace('_', '/');
        switch (output.length % 4) {
            case 0:
                break;
            case 2:
                output += '==';
                break;
            case 3:
                output += '=';
                break;
            default:
                throw 'Illegal base64url string!';
        }
        return window.atob(output);
    };
    MembershipService.prototype.getDataFromToken = function (token) {
        var data = {};
        if (typeof token !== 'undefined') {
            var encoded = token.split('.')[1];
            data = JSON.parse(this.urlBase64Decode(encoded));
        }
        return data;
    };
    MembershipService = __decorate([
        core_1.Injectable()
    ], MembershipService);
    return MembershipService;
}());
exports.MembershipService = MembershipService;
