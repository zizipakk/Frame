import { Headers, BaseRequestOptions } from '@angular/http';

const apiHostPath = 'http://localhost:5000/api'; //URI scheme + host + main path 

export class API {
    public static get AUTH(): string { return apiHostPath; }
    public static get APP(): string { return apiHostPath; }
} 

export class BaseHeaders {
    public static get HEADERS(): Headers { 
        let headers: Headers = new Headers({ 'Content-Type': 'application/json' });
        // headers.append('', '');
        return headers; 
    }
}
