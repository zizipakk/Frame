///<reference path="./../typings/globals/core-js/index.d.ts"/>
import { bootstrap }            from '@angular/platform-browser-dynamic';
import { provide }              from '@angular/core';
import {enableProdMode}         from '@angular/core';
import { APP_ROUTER_PROVIDERS } from './routes';
import { DataService }          from './services/dataService';
import { AppComponent }         from './app';
//factory services inject to services
import { HTTP_PROVIDERS, Headers, RequestOptions, BaseRequestOptions } from '@angular/http';
// Override the `LocationStrategy`
import { LocationStrategy, PathLocationStrategy } from '@angular/common';

enableProdMode();

class AppBaseRequestOptions extends BaseRequestOptions {
    headers: Headers = new Headers({
        'Content-Type': 'application/json'
    })
}

bootstrap(
    AppComponent,
    [
        APP_ROUTER_PROVIDERS,
        HTTP_PROVIDERS,
        provide(RequestOptions, { useClass: AppBaseRequestOptions }),
        provide(LocationStrategy, { useClass: PathLocationStrategy }),
        DataService
    ]
).catch(err => console.error(err));