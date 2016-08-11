"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
///<reference path="./../typings/globals/core-js/index.d.ts"/>
var platform_browser_dynamic_1 = require('@angular/platform-browser-dynamic');
var core_1 = require('@angular/core');
var core_2 = require('@angular/core');
var routes_1 = require('./routes');
var dataService_1 = require('./services/dataService');
var app_1 = require('./app');
//factory services inject to services
var http_1 = require('@angular/http');
// Override the `LocationStrategy`
var common_1 = require('@angular/common');
core_2.enableProdMode();
var AppBaseRequestOptions = (function (_super) {
    __extends(AppBaseRequestOptions, _super);
    function AppBaseRequestOptions() {
        _super.apply(this, arguments);
        this.headers = new http_1.Headers({
            'Content-Type': 'application/json'
        });
    }
    return AppBaseRequestOptions;
}(http_1.BaseRequestOptions));
platform_browser_dynamic_1.bootstrap(app_1.AppComponent, [
    routes_1.APP_ROUTER_PROVIDERS,
    http_1.HTTP_PROVIDERS,
    core_1.provide(http_1.RequestOptions, { useClass: AppBaseRequestOptions }),
    core_1.provide(common_1.LocationStrategy, { useClass: common_1.PathLocationStrategy }),
    dataService_1.DataService
]).catch(function (err) { return console.error(err); });
