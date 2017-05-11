import { Headers, BaseRequestOptions } from '@angular/http';

// TODO: better get this from unauth API, and put in redux store 
const apiHostPath = 'http://localhost:7200/api'; //URI scheme + host + main path 
const authHostPath = 'http://localhost:5200/';
const logHostPath = 'http://localhost:6200/api/';

export class API {
    public static get AUTH(): string { return authHostPath; }
    public static get APP(): string { return apiHostPath; }
    public static get LOG(): string { return logHostPath; }
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

    private static get TOKEN() {
        /** Set token if available */
        return sessionStorage.getItem("authorizationData"); //localStorage
    }

    public static AddToken(headers: Headers) {
        let token = AppHeaders.TOKEN.replace(new RegExp("\"", 'g'), "");

        if (token !== "" && token !== '""') {
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
