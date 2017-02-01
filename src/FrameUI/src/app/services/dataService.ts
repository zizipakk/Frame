import { Injectable, Type } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Router } from '@angular/router';
import { AuthHeaders, AppHeaders } from '../app.settings';
import { Observable } from 'rxjs/Rx'; //http://stackoverflow.com/questions/37030963/angular-2-2-0-0-rc-1-property-map-does-not-exist-on-type-observableresponse
import 'rxjs/add/operator/map';


import { SignInResult } from '../models/signInResult';

//A generic class used to GET/PUT/POST/DELETE over HTTP to server

@Injectable()
export class DataService {

    constructor(private http: Http, private router: Router) {
    }

    getById<T>(baseUri: string, id: number, pageSize?: number) {
        let pageSizeUri = pageSize ? encodeURI(pageSize.toString()) : '';
        let uri = baseUri 
            + '/' + id.toString() 
            + '&' + pageSizeUri;

        return this.http.get(uri, { headers: AppHeaders.HEADERS })
            // .map(response => <any>(<Response>response).json());
            .map(response => this.getResponseBody<T>(response))
            .catch(err =>  { 
                return Observable.throw(this.errorInfo(err)); // observable needs to be returned or exception raised
            });
    }

    get<T>(baseUri: string, pageSize?: number) {
        let pageSizeUri = pageSize ? encodeURI(pageSize.toString()) : '';
        let uri = baseUri
            + '&' + pageSizeUri;

        return this.http.get(uri, { headers: AppHeaders.HEADERS })
            .map(response => this.getResponseBody<T>(response))
            .catch(err =>  { 
                return Observable.throw(this.errorInfo(err)); // observable needs to be returned or exception raised
            });
    }

    post<T>(baseUri: string, data?: any) {
        let postHeaders = data && data.indexOf('grant_type') !== -1 ? { headers: AuthHeaders.HEADERS } : { headers: AppHeaders.HEADERS };
        return this.http.post(baseUri, data, postHeaders)
            .map(response => this.getResponseBody<T>(response))
            .catch(err =>  { 
                return Observable.throw(this.errorInfo(err)); // observable needs to be returned or exception raised
            });
    }

    deleteById<T>(baseUri: string, id: number) {
        return this.http.delete(baseUri + '/' + id.toString(), { headers: AppHeaders.HEADERS })
            .map(response => this.getResponseBody<T>(response))
            .catch(err =>  { 
                return Observable.throw(this.errorInfo(err)); // observable needs to be returned or exception raised
            });
    }

    getResponseBody<T>(response: any)
    {
        let body = response._body;
        if (body) { 
            return <T>JSON.parse(body);
        } else {
            return <T>response;
        }
    }

    errorInfo(error: any)
    {
        let response = <Response>error; 
        let messages: string[] = [];
        let body =  error._body;
        if (body)
        {
            let bodyJson = JSON.parse(body);
            messages.push('Error: ' + bodyJson.error + ', Description: ' + bodyJson.error_description); 
        }
        else
        {
            // TODO: ha html jön vissza az mvc-ről akkor kell ide egy dialog
            // switch(response.status)
            // {
            //     case 400:
            //         messages.push('Bad request');
            //         break;
            //     case 401:
            //         messages.push('Unauthorized');
            //         break;
            //     case 403:
            //         messages.push('Forbidden');
            //         break;
            //     default:
            //         messages.push(response.statusText);
            //         break;
            // }

            messages.push(response.statusText);
        }
        return messages;
    }
}