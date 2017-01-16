import { Headers, BaseRequestOptions } from '@angular/http';

// TODO: better get this from unauth API, and put in redux store 
const apiHostPath = 'http://localhost:5200/api'; //URI scheme + host + main path 
const authHostPath = 'http://localhost:5200/';

export class API {
    public static get AUTH(): string { return authHostPath; }
    public static get APP(): string { return apiHostPath; }
} 

export class BaseHeaders {
    public static get HEADERS(): Headers { 
        /** Set content type */
        let headers: Headers = new Headers({ 'Content-Type': 'application/json' });
        headers.append('Accept', 'application/json');
        
        /** Set token if available */
        let token = sessionStorage.getItem("authorizationData"); //localStorage
        if (token !== "") {
            headers.append('Authorization', 'Bearer ' + token);
        }

        return headers; 
    }
}


