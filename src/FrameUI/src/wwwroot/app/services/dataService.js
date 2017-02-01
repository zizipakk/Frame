var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@angular/core';
import { Http, RequestMethod } from '@angular/http';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ActionTypes } from '../reducers/reducer.settings';
import { AuthHeaders, AppHeaders } from '../app.settings';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
//A generic class used to GET/PUT/POST/DELETE over HTTP to server
export var DataService = (function () {
    function DataService(store, http, router) {
        this.store = store;
        this.http = http;
        this.router = router;
    }
    DataService.prototype.getById = function (baseUri, id, pageSize) {
        // let pageSizeUri = pageSize ? encodeURI(pageSize.toString()) : '';
        // let uri = baseUri 
        //     + '/' + id.toString() 
        //     + '&' + pageSizeUri;
        // return this.http.get(uri, { headers: AppHeaders.HEADERS })
        //     // .map(response => <any>(<Response>response).json());
        //     .map(response => this.getResponseBody<T>(response))
        //     .catch(err =>  { 
        //         return Observable.throw(this.errorInfo(err)); // observable needs to be returned or exception raised
        //     });
        var args = ({
            method: RequestMethod.Get,
            headers: AppHeaders.HEADERS
        });
        return this.httpRequest(baseUri
            + '/' + id.toString()
            + '&' + (pageSize
            ? encodeURI(pageSize.toString())
            : ''), args);
    };
    DataService.prototype.get = function (baseUri, pageSize) {
        // let pageSizeUri = pageSize ? encodeURI(pageSize.toString()) : '';
        // let uri = baseUri
        //     + '&' + pageSizeUri;
        // return this.http.get(uri, { headers: AppHeaders.HEADERS })
        //     .map(response => this.getResponseBody<T>(response))
        //     .catch(err =>  { 
        //         return Observable.throw(this.errorInfo(err));
        //     });
        var args = ({
            method: RequestMethod.Get,
            headers: AppHeaders.HEADERS
        });
        return this.httpRequest(baseUri + '&'
            + (pageSize
                ? encodeURI(pageSize.toString())
                : ''), args);
    };
    DataService.prototype.post = function (baseUri, data) {
        // let postHeaders = data && data.indexOf('grant_type') !== -1 
        //     ? { headers: AuthHeaders.HEADERS } 
        //     : { headers: AppHeaders.HEADERS };
        // return this.http.post(baseUri, data, postHeaders)
        //     .map(response => this.getResponseBody<T>(response))
        //     .catch(err =>  { 
        //         return Observable.throw(this.errorInfo(err));
        //     });
        var args = ({
            method: RequestMethod.Post,
            headers: data && data.indexOf('grant_type') !== -1
                ? AuthHeaders.HEADERS
                : AppHeaders.HEADERS,
            body: data
        });
        return this.httpRequest(baseUri, args);
    };
    DataService.prototype.deleteById = function (baseUri, id) {
        // return this.http.delete(baseUri + '/' + id.toString(), { headers: AppHeaders.HEADERS })
        //     .map(response => this.getResponseBody<T>(response))
        //     .catch(err =>  { 
        //         return Observable.throw(this.errorInfo(err));
        //     });
        var args = ({
            method: RequestMethod.Delete,
            headers: AppHeaders.HEADERS
        });
        return this.httpRequest(baseUri + '/' + id.toString(), args);
    };
    /**
     * There is the base generic http request method
     */
    DataService.prototype.httpRequest = function (url, options) {
        var _this = this;
        this.store.dispatch({ type: ActionTypes.SET_Blocker, payload: true }); //block UI
        return this.http.request(url, options)
            .map(function (response) { return _this.getResponseBody(response); })
            .catch(function (err) {
            return Observable.throw(_this.errorInfo(err));
        })
            .finally(function () {
            _this.store.dispatch({ type: ActionTypes.SET_Blocker, payload: false }); //unblock UI
        });
    };
    DataService.prototype.getResponseBody = function (response) {
        var body = response._body;
        if (body) {
            return JSON.parse(body);
        }
        else {
            return response;
        }
    };
    DataService.prototype.errorInfo = function (error) {
        var response = error;
        var messages = [];
        var body = error._body;
        if (body) {
            var bodyJson = JSON.parse(body);
            messages.push('Error: ' + bodyJson.error + ', Description: ' + bodyJson.error_description);
        }
        else {
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
    };
    DataService = __decorate([
        Injectable(), 
        __metadata('design:paramtypes', [Store, Http, Router])
    ], DataService);
    return DataService;
}());
//# sourceMappingURL=C:/Frame/Frame/src/FrameUI/src/app/services/dataService.js.map