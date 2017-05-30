import { Injectable, Type, Injector } from '@angular/core';
import { Http, Response, Headers, RequestOptionsArgs, RequestMethod } from '@angular/http';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { IappState } from '../models/appState';
import { ActionTypes } from '../reducers/reducer.settings'
import { AuthHeaders, AppHeaders, AuthWithTokenHeaders } from '../app.settings';
import { Observable } from 'rxjs/Rx'; //http://stackoverflow.com/questions/37030963/angular-2-2-0-0-rc-1-property-map-does-not-exist-on-type-observableresponse
import 'rxjs/add/operator/map';

/**
 * A generic class used to GET/PUT/POST/DELETE over HTTP to server 
 */
@Injectable()
export class DataService {

    // we are in singleton, but observers can cross-blocking
    blockerSemafor: string[];

    constructor(
        private store: Store<IappState>,
        private http: Http,
        private injector: Injector) {
        this.blockerSemafor = new Array<string>();
    }

    /**
    * this creates router property on your service, because cycling deps with http
    */
    get router(): Router { 
        return this.injector.get(Router);
    }

    getById<T>(baseUri: string, id: number, pageSize?: number) {
        let args: RequestOptionsArgs = ({
            method: RequestMethod.Get,
            headers: AppHeaders.HEADERS
        });
        return this.httpRequest<T>(
            baseUri
                + '/' + id.toString() 
                + (pageSize 
                    ? '&' + encodeURI(pageSize.toString()) 
                    : ''),
             args);
    }

    get<T>(baseUri: string, pageSize?: number) {
        let args: RequestOptionsArgs = ({
            method: RequestMethod.Get,
            headers: AppHeaders.HEADERS
        });
        return this.httpRequest<T>(
            baseUri
                + (pageSize 
                ? '&' + encodeURI(pageSize.toString()) 
                    : ''),
             args);
    }

    post<T>(baseUri: string, data?: any) {
        let args: RequestOptionsArgs = ({
            method: RequestMethod.Post,
            headers: AppHeaders.HEADERS,
            body: JSON.stringify(data)
        });
        return this.httpRequest<T>(baseUri, args);
    }

    postAuth<T>(baseUri: string, data?: any) {
        let args: RequestOptionsArgs = ({
            method: RequestMethod.Post,
            headers: AuthHeaders.HEADERS,
            body: data
        });
        return this.httpRequest<T>(baseUri, args);
    }

    postAuthhWithToken<T>(baseUri: string, data?: any) {
        let args: RequestOptionsArgs = ({
            method: RequestMethod.Post,
            headers: AuthWithTokenHeaders.HEADERS,
            body: data
        });
        return this.httpRequest<T>(baseUri, args);
    }

    deleteById<T>(baseUri: string, id: number) {
        let args: RequestOptionsArgs = ({
            method: RequestMethod.Delete,
            headers: AppHeaders.HEADERS
        });
        return this.httpRequest<T>(baseUri + '/' + id.toString(), args);
    }

    /**
     * There is the base generic http request method
     */
    httpRequest<T>(url: string, options?: RequestOptionsArgs) {
        let threadID = 'N' + Math.random() + '' + Date.now(); // Own thread
        this.blockerSemafor.push(threadID); 

        this.store.dispatch({ type: ActionTypes.SET_Blocker, payload: true }); //block UI

        return this.http.request(url, options)
            .map(response =>
                this.getResponseBody<T>(response))
            .catch(error => {
                return Observable.throw(this.errorInfo(error));
            })
            .finally(() => {
                if (this.blockerSemafor.length === 1
                    && this.blockerSemafor.indexOf(threadID) === 0) { // if nobody works, just this thread
                    this.store.dispatch({ type: ActionTypes.SET_Blocker, payload: false }); //unblock UI
                }
                this.blockerSemafor = this.blockerSemafor.filter(f => f !== threadID); // TODO: reference
            });
    }

    getResponseBody<T>(response: Response): T
    {
        try {
            return <T>(response.json()); // this take exception, if response body not json
        } catch(e) {
            return <T>(<any>(response.text()));
        }

    }

    errorInfo(error: Response)
    {
        let messages: string[] = [];
        let body: any;

        try {
            body =  error.json(); // this take exception, if body not json
        } catch(e) {
            body =  error.text() ?  error.text() : error.statusText;
        }

        if (body)  // TODO: If we become Html body from MVC by 500...
        {
            switch(error.status)
            {
                case 0 as number:
                    messages.push('Network error. Connection refused.');
                    break;
                case 400 as number:
                    if (body.error) {
                        messages.push('Error: ' + body.error + ', Description: ' + body.error_description);
                    } else {
                        messages.push('Error: ' + body);
                    }
                    break;
                case 401 as number:
                    messages.push('Unauthorized'); // TODO: convert to dialog message
                    this.router.navigate(['account/login'])
                    break;
                case 403 as number:
                    messages.push('Forbidden');
                    break;
                case 404 as number:
                    messages.push('Not found url');
                    break;
                case 406 as number:
                    messages.push('Unaccepted result');
                    break;
                case 500 as number:
                    messages.push('Internal Server Error');
                    break;
                case 502 as number:
                    messages.push('Bad Gateway / Time Out');
                    break;
                default:
                    messages.push(error.statusText);
                    break;
            }
        } else {
            // TODO. display html on modal
        }

        return messages;
    }
}