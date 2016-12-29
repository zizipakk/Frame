import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Router } from '@angular/router';
import { BaseHeaders } from '../app.settings';

import { Observable } from 'rxjs/Rx'; //http://stackoverflow.com/questions/37030963/angular-2-2-0-0-rc-1-property-map-does-not-exist-on-type-observableresponse
import 'rxjs/add/operator/map'; //

//A generic class used to GET/PUT/POST/DELETE over HTTP to server

@Injectable()
export class DataService {

    public pageSize: number;
    public baseUri: string;

    constructor(private http: Http, private router: Router) {

    }

    set(baseUri: string, pageSize?: number): void {
        this.baseUri = baseUri;
        this.pageSize = pageSize;
    }

    get(id?: number) {
        var uri = this.baseUri 
            + '/' + id.toString() 
            + this.pageSize ? '&' + this.pageSize.toString() : '';

        return this.http.get(uri)
            .map(response => (<Response>response));
    }

    post(data?: any, mapJson: boolean = true) {
        if (mapJson)
            return this.http.post(this.baseUri, data, { headers: BaseHeaders.HEADERS })
                .map(response => <any>(<Response>response).json());
        else
            return this.http.post(this.baseUri, data);
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