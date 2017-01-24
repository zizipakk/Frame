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

    idAction = '/connect'
    idLogin = API.AUTH + this.idAction + '/token';
    accountAction = 'account'
    accountRegister = API.AUTH + this.accountAction + '/register';
    accountInfo = API.AUTH + this.accountAction + '/info';
    accountLogout = API.AUTH + this.accountAction + '/logout';
    storage: any;

    constructor(private dataService: DataService) {
        this.storage = sessionStorage;

        if (this.retrieve("IsAuthorized") !== "") {
            this.HasAdminRole = this.retrieve("HasAdminRole");
            this.IsAuthorized = this.retrieve("IsAuthorized");
        }
    }

    public IsAuthorized: boolean;
    public HasAdminRole: boolean;
    public UserName: string;
    
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
        this.dataService.set(this.accountRegister);
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
        let state = Date.now() + "" + Math.random();

        let username = creds.email;
        let password = creds.password;

        let offlineaccess = creds.rememberLogin ? " offlineaccess" : "";
        let scope = "openid profile roles" + offlineaccess;

        // TODO: redux store & state ?
        this.store("authNonce", nonce);
        this.store("authStateControl", state);

        let model = new OpenIdConnectRequest();
        model.grant_type = grant_type;
        model.nonce = nonce;
        model.state = state;
        model.username = username;
        model.password = password;
        model.scope = scope;

        this.dataService.set(this.idLogin); 
        return this.dataService.post(this.encodeQueryData(model));
    }

    loginCallback(result: SignInResult) {
        console.log("BEGIN AuthorizedCallback, clear old data");
        this.resetAuthorizationData();

        console.log(result);
        console.log("AuthorizedCallback created, begin token validation");

        let token = "";
        let id_token = "";

// TODO
        // if (result.state !== this.retrieve("authStateControl")) {
        //     console.log("AuthorizedCallback incorrect state");
        // } else {
            token = result.access_token;
            id_token = result.id_token

            // TODO: typed
            let dataIdToken: any = this.getDataFromToken(id_token);
            console.log(dataIdToken);

            // validate nonce
            if (!dataIdToken || dataIdToken.nonce !== this.retrieve("authNonce")) {
                console.log("AuthorizedCallback incorrect nonce");
                this.resetAuthorizationData();
            } else {
                this.store("authNonce", "");
                this.store("authStateControl", "");

                console.log("AuthorizedCallback state and nonce validated, returning access token");
                this.setAuthorizationData(token, id_token, dataIdToken);
            }
        // }

    }

    setAuthorizationData(token: string, id_token: string, data: any) {
        console.log(token);
        console.log(id_token);    
        console.log("storing to storage, getting the roles");
        this.store("authorizationData", token);
        this.store("authorizationDataIdToken", id_token);
        this.IsAuthorized = true;
        this.store("IsAuthorized", true); //TODO: redux

        if (data.role)
            for (var i = 0; i < data.role.length; i++) {
                console.log("Role: " + data.role[i]);
                if (data.role[i] === "admin") {
                    this.HasAdminRole = true;
                    this.store("HasAdminRole", true) //TODO: redux
                }
            }
        
        console.log("User: " + data.unique_name);
        if (data.unique_name)
        {
            this.UserName = data.unique_name;
            this.store("UserName", data.unique_name);  //TODO: redux
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
    
    //TODO
    logout() {
        this.resetAuthorizationData();

        // No redirection
        let id_token_hint = this.retrieve("authorizationDataIdToken");
        //let post_logout_redirect_uri = this._configuration.Server + '/Unauthorized';
        let url =
            this.accountLogout + "?" +
            "id_token_hint=" + encodeURI(id_token_hint) 
            // + "&" + "post_logout_redirect_uri=" + encodeURI(post_logout_redirect_uri)
            ;

        // window.location.href = url;

        this.dataService.set(url);
        return this.dataService.post(null, false);
    }

    getUserData() {
        this.dataService.set(this.accountInfo);
        return this.dataService.get();
    }

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

}