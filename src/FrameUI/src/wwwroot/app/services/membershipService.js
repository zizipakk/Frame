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
import { Store } from '@ngrx/store';
import { UserModel } from '../models/user';
import { ActionTypes } from '../reducers/reducer.settings';
import { API } from '../app.settings';
import { DataService } from './dataService';
import { OpenIdConnectRequest } from '../models/openIdConnectRequest';
/**
    A class to manage user authentication
    uses local storage to save user authentication cookies
    OpenID and tokens are persist in local store
*/
export var MembershipService = (function () {
    function MembershipService(appStore, dataService) {
        this.appStore = appStore;
        this.dataService = dataService;
        this.idAction = 'connect';
        this.idLogin = API.AUTH + this.idAction + '/token';
        this.idRegister = API.AUTH + this.idAction + '/register';
        this.idLogout = API.AUTH + this.idAction + '/logoff';
        this.storage = sessionStorage;
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
        return this.dataService.post(this.idLogout, JSON.stringify(newUser));
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
        var offlineaccess = creds.rememberLogin ? " offlineaccess" : "";
        var scope = "openid profile roles" + offlineaccess;
        // TODO: redux store & state ?
        this.store("authNonce", nonce);
        var model = new OpenIdConnectRequest();
        model.grant_type = grant_type;
        model.nonce = nonce;
        model.username = creds.email;
        model.password = creds.password;
        model.scope = scope;
        return this.dataService.post(this.idLogin, this.encodeQueryData(model));
    };
    MembershipService.prototype.loginCallback = function (result) {
        console.log("BEGIN AuthorizedCallback, clear old data");
        this.resetAuthorizationData();
        console.log(result);
        console.log("AuthorizedCallback created, begin token validation");
        var dataIdToken = this.getDataFromToken(result.id_token); // more types
        console.log(dataIdToken);
        if (!dataIdToken || dataIdToken.nonce !== this.retrieve("authNonce")) {
            console.log("AuthorizedCallback incorrect nonce");
            this.resetAuthorizationData();
        }
        else {
            this.store("authNonce", "");
            this.store("authStateControl", "");
            console.log("AuthorizedCallback state and nonce validated, returning access token");
            this.setAuthorizationData(result.access_token, result.id_token, dataIdToken);
        }
    };
    MembershipService.prototype.setAuthorizationData = function (token, id_token, data) {
        console.log(token);
        console.log(id_token);
        console.log("storing to storage, getting the roles");
        this.store("authorizationData", token);
        this.store("authorizationDataIdToken", id_token);
        var user = new UserModel({ isAuthorized: false, hasAdminRole: false, userName: '' });
        user.isAuthorized = true;
        this.store("IsAuthorized", true);
        if (data.role instanceof Array) {
            for (var i = 0; i < data.role.length; i++) {
                console.log("Role: " + data.role[i]);
                if (data.role[i].toUpperCase() === "ADMIN") {
                    user.hasAdminRole = true;
                    this.store("HasAdminRole", true);
                }
            }
        }
        else if (data.role) {
            console.log("Role: " + data.role);
            if (data.role.toUpperCase() === "ADMIN") {
                user.hasAdminRole = true;
                this.store("HasAdminRole", true);
            }
        }
        if (data.username) {
            console.log("User: " + data.username);
            user.userName = data.username;
            this.store("UserName", data.username);
        }
        this.appStore.dispatch({ type: ActionTypes.SET_User, payload: user });
    };
    MembershipService.prototype.resetAuthorizationData = function () {
        this.store("authorizationData", "");
        this.store("authorizationDataIdToken", "");
        this.store("HasAdminRole", false);
        this.store("IsAuthorized", false);
        this.store("UserName", '');
        this.appStore.dispatch({ type: ActionTypes.RESET_User });
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
    MembershipService.prototype.logout = function () {
        //let id_token_hint = this.retrieve("authorizationDataIdToken");
        //return this.dataService.post(this.idLogout, "id_token_hint=" + id_token_hint);
        return this.dataService.post(this.idLogout);
    };
    MembershipService.prototype.logoutCallback = function () {
        console.log("BEGIN logoutCallback, clear auth data");
        this.resetAuthorizationData();
    };
    MembershipService = __decorate([
        Injectable(), 
        __metadata('design:paramtypes', [Store, DataService])
    ], MembershipService);
    return MembershipService;
}());
//# sourceMappingURL=C:/Frame/Frame/src/FrameUI/src/app/services/membershipService.js.map