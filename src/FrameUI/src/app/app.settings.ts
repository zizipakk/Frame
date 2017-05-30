import { Headers, BaseRequestOptions } from '@angular/http';

//const apiHostPath = 'http://localhost:7200/'; //URI scheme + host + main path 
//const authHostPath = 'http://localhost:5200/';
//const logHostPath = 'http://localhost:6200/api/';

const configFullPath = './assets/appSettings.json';

/**
 * This setting changed only one, at bootstrapping, so dont need for redux
 */
export class API {
    public static get CONFIG(): string { return configFullPath; }

    static apiHostPath: string;
    static authHostPath: string;
    static logHostPath: string;

    public static get AUTH(): string { return API.authHostPath; }
    public static set AUTH(value) { API.authHostPath = value; }
    public static get APP(): string { return API.apiHostPath; }
    public static set APP(value: string) { API.apiHostPath = value; }
    public static get LOG(): string { return API.logHostPath; }
    public static set LOG(value: string) { API.logHostPath = value; }
} 

export class AppHeaders {
    public static get HEADERS(): Headers { 
        /** Set content type */
        let headers: Headers = new Headers({ 'Content-Type': 'application/json' });
        //headers.append('Accept', 'application/json');
        
        /** Set token if available */
        this.AddToken(headers);

        return headers; 
    }

    public static AddToken(headers: Headers) {
        let token = sessionStorage.getItem("authorizationData"); //localStorage

        if (token && token !== '""') {
            token = token.replace(new RegExp("\"", 'g'), "");
            headers.append('Authorization', 'Bearer ' + token);            
        }
        return headers; 
    }
}

export class AuthHeaders {
    public static get HEADERS(): Headers { 
        /** Set content type for auth*/
        let headers: Headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });

        return headers; 
    }
}

export class AuthWithTokenHeaders {
    public static get HEADERS(): Headers { 
        /** Set content type for auth*/
        let headers: Headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        /** Set token if available */
        AppHeaders.AddToken(headers);
        return headers; 
    }
}
