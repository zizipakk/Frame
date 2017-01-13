"use strict";
var http_1 = require('@angular/http');
var apiHostPath = 'http://localhost:5000/api'; //URI scheme + host + main path 
var authHostPath = 'http://localhost:32773/';
var API = (function () {
    function API() {
    }
    Object.defineProperty(API, "AUTH", {
        get: function () { return authHostPath; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(API, "APP", {
        get: function () { return apiHostPath; },
        enumerable: true,
        configurable: true
    });
    return API;
}());
exports.API = API;
var BaseHeaders = (function () {
    function BaseHeaders() {
    }
    Object.defineProperty(BaseHeaders, "HEADERS", {
        get: function () {
            /** Set content type */
            var headers = new http_1.Headers({ 'Content-Type': 'application/json' });
            headers.append('Accept', 'application/json');
            /** Set token if available */
            var token = sessionStorage.getItem("authorizationData"); //localStorage
            if (token !== "") {
                headers.append('Authorization', 'Bearer ' + token);
            }
            return headers;
        },
        enumerable: true,
        configurable: true
    });
    return BaseHeaders;
}());
exports.BaseHeaders = BaseHeaders;
