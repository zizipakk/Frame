﻿import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { ActionTypes } from '../reducers/reducer.settings'
import { IappState } from '../models/appState';
import { API } from '../app.settings';
import { DataService } from './dataService';
import { Iregistration } from '../models/registration';
import { IloginInputModel } from '../models/user';
import { IopenIdConnectRequest } from '../models/openIdConnectRequest';
import { IsignInResult } from '../models/signInResult';
import { IuserModel, UserModel } from '../models/user';

/** 
    A class to manage user authentication
    uses local storage to save user authentication cookies
    OpenID and tokens are persist in local store
*/
@Injectable()
export class MembershipService {

    readonly idAction = 'connect'
    idLogin = API.AUTH + this.idAction + '/token';
    idRegister = API.AUTH + this.idAction + '/register';
    idLogout = API.AUTH + this.idAction + '/logoff';
    storage: any;

    constructor(
        private appStore: Store<IappState>,
        private dataService: DataService
        ) {
        this.storage = sessionStorage;
        let user: IuserModel = { // At first we check the persistent data in local storage
            userId: this.retrieve('UserId'),
            isAuthorized: this.retrieve('IsAuthorized'),
            hasAdminRole: this.retrieve('HasAdminRole'),            
            userName: this.retrieve('UserName')
        };
        // Memory init from local store
        this.appStore.dispatch({ type: ActionTypes.SET_User, payload: user });
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

    register(newUser: Iregistration) {
        //return this.dataService.post(this.idRegister, JSON.stringify(newUser));
        return this.dataService.post(this.idRegister, newUser);
    }

    private encodeQueryData(data) {
        let ret = [];
        for (let d in data) {
            ret.push(encodeURI(d + '=' + data[d]));
        }
        return ret.join('&');
    }

    /** IdentityServer4 endpont use only get method */
    login(creds: IloginInputModel) {
        this.resetAuthorizationData();

        let grant_type = 'password';
        let nonce = 'N' + Math.random() + '' + Date.now();

        // let offlineaccess = creds.rememberLogin ? ' offlineaccess' : '';
        let scope = 'openid email profile roles'; // + offlineaccess;

        this.store('authNonce', nonce);

        let model: IopenIdConnectRequest = {
            grant_type: grant_type,
            nonce: nonce,
            username: creds.email,
            password: creds.password,
            scope: scope
        };

        return this.dataService.postAuth<IsignInResult>(this.idLogin, this.encodeQueryData(model));
    }

    loginCallback(result: IsignInResult) {
        console.log('BEGIN AuthorizedCallback, clear old data');
        this.resetAuthorizationData();

        console.log(result);
        console.log('AuthorizedCallback created, begin token validation');

        let dataIdToken: any = this.getDataFromToken(result.id_token); // more types
        console.log(dataIdToken);

        if (!dataIdToken || dataIdToken.nonce !== this.retrieve('authNonce')) {
            console.log('AuthorizedCallback incorrect nonce');
            this.resetAuthorizationData();
        } else {
            this.store('authNonce', '');
            this.store('authStateControl', '');

            console.log('AuthorizedCallback state and nonce validated, returning access token');
            this.setAuthorizationData(result.access_token, result.id_token, dataIdToken);
        }
    }

    setAuthorizationData(token: string, id_token: string, data: any) {
        console.log(token);
        console.log(id_token);
        console.log('storing to storage, getting the roles');
        this.store('authorizationData', token);
        this.store('authorizationDataIdToken', id_token);

        let user = new UserModel();
        user.isAuthorized = true;
        this.store('IsAuthorized', true);

        if (data.role instanceof Array)
        {
            for (var i = 0; i < data.role.length; i++) {
                console.log('Role: ' + data.role[i]);
                if (data.role[i].toUpperCase() === 'ADMIN') {
                    user.hasAdminRole = true;
                    this.store('HasAdminRole', true);
                }
            }
        } else if (data.role) {
            console.log('Role: ' + data.role);
            if (data.role.toUpperCase() === 'ADMIN') {
                    user.hasAdminRole = true;
                    this.store('HasAdminRole', true);
                }
        }

        if (data.name)
        {
            console.log('User: ' + data.name);
            user.userName = data.name;
            this.store('UserName', data.name);
        }

        if (data.sub)
        {
            console.log('UserId: ' + data.sub);
            user.userId = data.sub;
            this.store('UserId', data.sub);
        }

        this.appStore.dispatch({ type: ActionTypes.SET_User, payload: user });
    }

    resetAuthorizationData() {
        this.store('authorizationData', '');
        this.store('authorizationDataIdToken', '');
        this.store('HasAdminRole', false);
        this.store('IsAuthorized', false);
        this.store('UserName', '');

        this.appStore.dispatch({ type: ActionTypes.RESET_User });
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

    logout() {
        return this.dataService.postAuthhWithToken<any>(this.idLogout);
    }

    logoutCallback() {
        console.log('BEGIN logoutCallback, clear auth data');
        this.resetAuthorizationData();
    }

}