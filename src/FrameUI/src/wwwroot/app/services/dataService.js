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
import { Http } from '@angular/http';
import { Router } from '@angular/router';
import { BaseHeaders } from '../app.settings';
import 'rxjs/add/operator/map';
//A generic class used to GET/PUT/POST/DELETE over HTTP to server
export var DataService = (function () {
    function DataService(http, router) {
        this.http = http;
        this.router = router;
    }
    DataService.prototype.set = function (baseUri, pageSize) {
        this.baseUri = baseUri;
        this.pageSize = pageSize;
        this.pageSizeUri = this.pageSize ? encodeURI(this.pageSize.toString()) : '';
    };
    DataService.prototype.getById = function (id) {
        var uri = this.baseUri
            + '/' + id.toString()
            + '&' + this.pageSizeUri;
        return this.http.get(uri)
            .map(function (response) { return (response); });
    };
    DataService.prototype.get = function () {
        this.pageSizeUri = this.pageSizeUri ? '&pageSize=' + this.pageSizeUri : '';
        var uri = this.baseUri
            + this.pageSizeUri;
        return this.http.get(uri)
            .map(function (response) { return (response); });
    };
    DataService.prototype.post = function (data, mapJson) {
        if (mapJson === void 0) { mapJson = true; }
        if (mapJson)
            return this.http.post(this.baseUri, JSON.stringify(data), { headers: BaseHeaders.HEADERS })
                .map(function (response) { return response.json(); });
        else
            return this.http.post(this.baseUri, data, { headers: BaseHeaders.HEADERS });
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
        Injectable(), 
        __metadata('design:paramtypes', [Http, Router])
    ], DataService);
    return DataService;
}());
//# sourceMappingURL=C:/FRAME/Frame/src/FrameUI/src/app/services/dataService.js.map