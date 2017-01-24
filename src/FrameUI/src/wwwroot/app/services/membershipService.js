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
import { API } from '../app.settings';
import { DataService } from './dataService';
import { OpenIdConnectRequest } from '../models/openIdConnectRequest';
/**
    A class to manage user authentication
    uses local storage to save user authentication cookies
    OpenID and tokens are persist in local store
*/
export var MembershipService = (function () {
    function MembershipService(dataService) {
        this.dataService = dataService;
        this.idAction = '/connect';
        this.idLogin = API.AUTH + this.idAction + '/token';
        this.accountAction = 'account';
        this.accountRegister = API.AUTH + this.accountAction + '/register';
        this.accountInfo = API.AUTH + this.accountAction + '/info';
        this.accountLogout = API.AUTH + this.accountAction + '/logout';
        this.storage = sessionStorage;
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
        this.dataService.set(this.accountRegister);
        return this.dataService.post(JSON.stringify(newUser));
    };
    MembershipService.prototype.encodeQueryData = function (data) {
        var ret = [];
        for (var d in data)
            ret.push(encodeURI(d + '=' + data[d]));
        return ret.join('&');
    };
    /** IdentityServer4 endpont use only get method */
    MembershipService.prototype.login = function (creds) {
        this.resetAuthorizationData();
        var grant_type = "password";
        var nonce = "N" + Math.random() + "" + Date.now();
        var state = Date.now() + "" + Math.random();
        var username = creds.email;
        var password = creds.password;
        var offlineaccess = creds.rememberLogin ? " offlineaccess" : "";
        var scope = "openid profile roles" + offlineaccess;
        this.store("authNonce", nonce);
        this.store("authStateControl", state);
        var model = new OpenIdConnectRequest(null);
        model.GrantType = grant_type;
        model.Nonce = nonce;
        model.State = state;
        model.Username = username;
        model.Password = password;
        model.Scope = scope;
        this.dataService.set(this.idLogin);
        return this.dataService.post(model);
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
        // No redirection
        var id_token_hint = this.retrieve("authorizationDataIdToken");
        //let post_logout_redirect_uri = this._configuration.Server + '/Unauthorized';
        var url = this.accountLogout + "?" +
            "id_token_hint=" + encodeURI(id_token_hint);
        // window.location.href = url;
        this.dataService.set(url);
        return this.dataService.post(null, false);
    };
    MembershipService.prototype.getUserData = function () {
        this.dataService.set(this.accountInfo);
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
        Injectable(), 
        __metadata('design:paramtypes', [DataService])
    ], MembershipService);
    return MembershipService;
}());
//# sourceMappingURL=C:/FRAME/Frame/src/FrameUI/src/app/services/membershipService.js.map