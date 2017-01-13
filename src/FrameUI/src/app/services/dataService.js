"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var app_settings_1 = require('../app.settings');
require('rxjs/add/operator/map'); //
//A generic class used to GET/PUT/POST/DELETE over HTTP to server
var DataService = (function () {
    function DataService(http, router) {
        this.http = http;
        this.router = router;
    }
    DataService.prototype.set = function (baseUri, pageSize) {
        this.baseUri = baseUri;
        this.pageSize = pageSize;
    };
    DataService.prototype.get = function (id) {
        var uri = this.baseUri
            + '/' + id.toString()
            + this.pageSize ? '&' + this.pageSize.toString() : '';
        return this.http.get(uri)
            .map(function (response) { return (response); });
    };
    DataService.prototype.post = function (data, mapJson) {
        if (mapJson === void 0) { mapJson = true; }
        if (mapJson)
            return this.http.post(this.baseUri, data, { headers: app_settings_1.BaseHeaders.HEADERS })
                .map(function (response) { return response.json(); });
        else
            return this.http.post(this.baseUri, data);
    };
    DataService.prototype.delete = function (id) {
        return this.http.delete(this.baseUri + '/' + id.toString())
            .map(function (response) { return response.json(); });
    };
    DataService.prototype.deleteResource = function (resource) {
        return this.http.delete(resource)
            .map(function (response) { return response.json(); });
    };
    DataService = __decorate([
        //
        core_1.Injectable()
    ], DataService);
    return DataService;
}());
exports.DataService = DataService;
