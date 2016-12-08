import { Headers, BaseRequestOptions } from '@angular/http';

const apiHostPath = 'http://localhost:5200/api'; //URI scheme + host + main path 

export class API {
    public static get AUTH(): string { return apiHostPath; }
    public static get APP(): string { return apiHostPath; }
} 

export class AppBaseRequestOptions extends BaseRequestOptions {
    headers: Headers = new Headers({
        'Content-Type': 'application/json'
    })

    //constructor() {
    //    super();
    //    this.headers.append('Content-Type', 'application/json');
    //    //this.headers.append('Access-Control-Allow-Origin', '*'); //just for CORS
    //}
}
