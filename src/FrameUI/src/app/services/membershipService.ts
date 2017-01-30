import { Injectable } from '@angular/core';
import { API } from '../app.settings';
import { DataService } from './dataService';
import { Registration } from '../models/registration';
import { LoginInputModel } from '../models/user';
import { OpenIdConnectRequest } from '../models/openIdConnectRequest';
import { SignInResult } from '../models/signInResult';

/** 
    A class to manage user authentication
    uses local storage to save user authentication cookies
    OpenID and tokens are persist in local store
*/
@Injectable()
export class MembershipService {

    idAction = 'connect'
    idLogin = API.AUTH + this.idAction + '/token';
    idRegister = API.AUTH + this.idAction + '/register';
    idLogout = API.AUTH + this.idAction + '/logoff';
    storage: any;

    public HasAdminRole: boolean;
    public IsAuthorized: boolean;
    public UserName: string;
        
    constructor(private dataService: DataService) {
        this.storage = sessionStorage;

        if (this.retrieve("IsAuthorized") !== "") {
            this.HasAdminRole = this.retrieve("HasAdminRole");
            this.IsAuthorized = this.retrieve("IsAuthorized");
            this.UserName = this.retrieve("UserName");
        }
    }

    /** Read store */
    retrieve(key: string): any {
        let item = this.storage.getItem(key);

        if (item && item !== 'undefined') {
            return JSON.parse(item);
        }

        return;
    }

    /** Write store */
    store(key: string, value: any) {
        this.storage.setItem(key, JSON.stringify(value));
    }

    register(newUser: Registration) {
        this.dataService.set(this.idLogout);
        return this.dataService.post(JSON.stringify(newUser));
    }

    private encodeQueryData(data) {
        let ret = [];
        for (let d in data)
            ret.push(encodeURI(d + '=' + data[d]));
        return ret.join('&');
    }

    /** IdentityServer4 endpont use only get method */
    login(creds: LoginInputModel) {
        this.resetAuthorizationData();

        let grant_type = "password";
        let nonce = "N" + Math.random() + "" + Date.now();

        let offlineaccess = creds.rememberLogin ? " offlineaccess" : "";
        let scope = "openid profile roles" + offlineaccess;

        // TODO: redux store & state ?
        this.store("authNonce", nonce);

        let model = new OpenIdConnectRequest();
        model.grant_type = grant_type;
        model.nonce = nonce;
        model.username = creds.email;
        model.password = creds.password;
        model.scope = scope;

        this.dataService.set(this.idLogin); 
        return this.dataService.post(this.encodeQueryData(model));
    }

    loginCallback(result: SignInResult) {
        console.log("BEGIN AuthorizedCallback, clear old data");
        this.resetAuthorizationData();

        console.log(result);
        console.log("AuthorizedCallback created, begin token validation");
        
        let dataIdToken: any = this.getDataFromToken(result.id_token); // more types
        console.log(dataIdToken);

        if (!dataIdToken || dataIdToken.nonce !== this.retrieve("authNonce")) {
            console.log("AuthorizedCallback incorrect nonce");
            this.resetAuthorizationData();
        } else {
            this.store("authNonce", "");
            this.store("authStateControl", "");

            console.log("AuthorizedCallback state and nonce validated, returning access token");
            this.setAuthorizationData(result.access_token, result.id_token, dataIdToken);
        }

    }

    setAuthorizationData(token: string, id_token: string, data: any) {
        console.log(token);
        console.log(id_token);    
        console.log("storing to storage, getting the roles");
        this.store("authorizationData", token);
        this.store("authorizationDataIdToken", id_token);
        this.IsAuthorized = true;
        this.store("IsAuthorized", true);

        if (data.role instanceof Array)
        {        
            for (var i = 0; i < data.role.length; i++) {
                console.log("Role: " + data.role[i]);
                if (data.role[i].toUpperCase() === "ADMIN") {
                    this.HasAdminRole = true;
                    this.store("HasAdminRole", true);
                }
            }
        } else {
            console.log("Role: " + data.role);
            if (data.role.toUpperCase() === "ADMIN") {
                    this.HasAdminRole = true;
                    this.store("HasAdminRole", true);
                }
        }
        
        if (data.username)
        {
            console.log("User: " + data.username);
            this.UserName = data.username;
            this.store("UserName", data.username);
        }
    }

    resetAuthorizationData() {
        this.IsAuthorized = false;
        this.HasAdminRole = false;
        this.store("authorizationData", "");
        this.store("authorizationDataIdToken", "");
        this.store("HasAdminRole", false);
        this.store("IsAuthorized", false);
        this.UserName = '';
        this.store("UserName", '');
    }
        
    // TODO
    // getUserData() {
    //     this.dataService.set(this.accountInfo);
    //     return this.dataService.get();
    // }

    urlBase64Decode(str: string) {
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
    }
    
    getDataFromToken(token: any) {
        var data = {};
        if (typeof token !== 'undefined') {
            var encoded = token.split('.')[1];
            data = JSON.parse(this.urlBase64Decode(encoded));
        }

        return data;
    }

    logout() {

        //let id_token_hint = this.retrieve("authorizationDataIdToken");

        this.dataService.set(this.idLogout);
        //return this.dataService.post("id_token_hint=" + id_token_hint);
        return this.dataService.post();
    }

    logoutCallback() {
        console.log("BEGIN logoutCallback, clear auth data");
        this.resetAuthorizationData();
    }

    
}