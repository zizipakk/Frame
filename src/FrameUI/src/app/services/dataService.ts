import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Router } from '@angular/router';
import { AuthHeaders } from '../app.settings';
import { AppHeaders } from '../app.settings';

import { Observable } from 'rxjs/Rx'; //http://stackoverflow.com/questions/37030963/angular-2-2-0-0-rc-1-property-map-does-not-exist-on-type-observableresponse
import 'rxjs/add/operator/map'; //

//A generic class used to GET/PUT/POST/DELETE over HTTP to server

@Injectable()
export class DataService {

    private baseUri: string;
    private pageSize: number;
    private pageSizeUri: string;

    constructor(private http: Http, private router: Router) {
    }

    set(baseUri: string, pageSize?: number): void {
        this.baseUri = baseUri;
        this.pageSize = pageSize;
        this.pageSizeUri = this.pageSize ? encodeURI(this.pageSize.toString()) : '';
    }

    getById(id?: number) {
        let uri = this.baseUri 
            + '/' + id.toString() 
            + '&' + this.pageSizeUri;

        return this.http.get(uri)
            .map(response => (<Response>response));
    }

    get() {
        this.pageSizeUri = this.pageSizeUri ? '&pageSize=' + this.pageSizeUri : '';
        let uri = this.baseUri + this.pageSizeUri;

        return this.http.get(uri)
            .map(response => (<Response>response));
    }

    post(data?: any, mapJson: boolean = true) {
        let postHeaders = data && data.indexOf('grant_type') !== -1 ? { headers: AuthHeaders.HEADERS } : { headers: AppHeaders.HEADERS };
        let response = this.http.post(this.baseUri, data, postHeaders);
        if (mapJson)
            return response.map(r => <any>(<Response>r).json());
        
        return response;
    }

    delete(id: number) {
        return this.http.delete(this.baseUri + '/' + id.toString())
            .map(response => <any>(<Response>response).json())
    }

    deleteResource(resource: string) {
        return this.http.delete(resource)
            .map(response => <any>(<Response>response).json())
    }
}