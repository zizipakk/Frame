import { Injectable } from '@angular/core';
import { API } from '../app.settings';
import { DataService } from './dataService';
import { Registration } from '../models/registration';
import { User } from '../models/user';

//A class to manage user authentication
//uses local storage to save user authentication cookies

@Injectable()
export class MembershipService {

    action = '/account'
    accountRegisterAPI = API.AUTH + this.action + '/register';
    accountInfoAPI = API.AUTH + this.action + '/info';
    accountLoginAPI = API.AUTH + this.action + '/login';
    accountLogoutAPI = API.AUTH + this.action + '/logout';
    storage: any;

    constructor(private dataService: DataService) {
        this.storage = sessionStorage; //localStorage;

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
        this.dataService.set(this.accountRegisterAPI);
        return this.dataService.post(JSON.stringify(newUser));
    }

    login(creds: User) {
        this.resetAuthorizationData();

        // var authorizationUrl = this._configuration.Server + '/connect/authorize';
        // var client_id = 'singleapp';
        // var redirect_uri = this._configuration.Server + '/index.html';
        // var response_type = "id_token token";
        // var scope = "dataEventRecords openid";
        let nonce = "N" + Math.random() + "" + Date.now();
        let state = Date.now() + "" + Math.random();

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

    }

    loginCallback() {
        console.log("BEGIN AuthorizedCallback, no auth data");
        this.resetAuthorizationData();

        let hash = window.location.hash.substr(1);

        let result: any = hash.split('&').reduce(function (result: any, item: string) {
            let parts = item.split('=');
            result[parts[0]] = parts[1];
            return result;
        }, {});

        console.log(result);
        console.log("AuthorizedCallback created, begin token validation");

        let token = "";
        let id_token = "";
        let authResponseIsValid = false;
        if (!result.error) {

            if (result.state !== this.retrieve("authStateControl")) {
                console.log("AuthorizedCallback incorrect state");
            } else {

                token = result.access_token;
                id_token = result.id_token

                let dataIdToken: any = this.getDataFromToken(id_token);
                console.log(dataIdToken);

                // validate nonce
                if (dataIdToken.nonce !== this.retrieve("authNonce")) {
                    console.log("AuthorizedCallback incorrect nonce");
                } else {
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
            // this.router.navigate(['/list']); TODO noti
        }
        else {
            this.resetAuthorizationData();
            // this.router.navigate(['/Unauthorized']);
        }
    }

    setAuthorizationData(token: any, id_token:any) {
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

        var data: any = this.getDataFromToken(id_token);
        
        console.log(data);
        
        for (var i = 0; i < data.role.length; i++) {
           console.log("Role: " + data.role[i]);
           if (data.role[i] === "admin") {
               this.HasAdminRole = true;
               this.store("HasAdminRole", true)
           }
        }

        this.UserName = data.username;
        this.store("UserName", data.username);
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
    
    logout() {
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

    }

    getUserData() {
        this.dataService.set(this.accountInfoAPI);
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

    /** We dont store user data local */
    // isUserAuthenticated(): boolean {
    //     var user = localStorage.getItem('user');
    //     if (user != null)
    //         return true;
    //     else
    //         return false;
    // }

    // getLoggedInUser(): User {
    //     var user: User;

    //     if (this.isUserAuthenticated()) {
    //         var userData = JSON.parse(localStorage.getItem('user'));
    //         user = new User(userData.Username, userData.Password);
    //     }

    //     return user;
    // }

}