import { Injectable, Type } from '@angular/core';
import { Http, Response, Headers, RequestOptionsArgs, RequestMethod } from '@angular/http';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { IappState } from '../models/appState';
import { ActionTypes } from '../reducers/reducer.settings'
import { AuthHeaders, AppHeaders } from '../app.settings';
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
        private router: Router) {
        this.blockerSemafor = new Array<string>();
    }

    getById<T>(baseUri: string, id: number, pageSize?: number) {
        let args: RequestOptionsArgs = ({
            method: RequestMethod.Get,
            headers: AppHeaders.HEADERS
        });
        return this.httpRequest<T>(
            baseUri
                + '/' + id.toString() 
                + '&' + (pageSize 
                            ? encodeURI(pageSize.toString()) 
                            : ''),
             args);
    }

    get<T>(baseUri: string, pageSize?: number) {
        let args: RequestOptionsArgs = ({
            method: RequestMethod.Get,
            headers: AppHeaders.HEADERS
        });
        return this.httpRequest<T>(
            baseUri + '&' 
                + (pageSize 
                    ? encodeURI(pageSize.toString()) 
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
            body =  error.text();
        }

        if (body)  // TODO: If we become Html body from MVC by 500...
        {
            switch(error.status)
            {
                case 0:
                    messages.push('Network error. Connection refused.');
                    break;
                case 400: // Error message from OpenIDDict server
                    if (body.error) { // json object
                        messages.push('Error: ' + body.error + ', Description: ' + body.error_description);
                    } else { // text
                        messages.push('Error: ' + body);
                    }
                    break;
                case 401:
                    messages.push('Unauthorized');
                    break;
                case 403:
                    messages.push('Forbidden');
                    break;
                case 500: // Wont work, because no allow origin header in response
                    messages.push('Internal Server Error');
                    break;
                default:
                    messages.push(error.statusText);
                    break;
            }
        }

        return messages;
    }
}