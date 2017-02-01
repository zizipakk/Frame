import { Headers } from '@angular/http';
// TODO: better get this from unauth API, and put in redux store 
var apiHostPath = 'http://localhost:5200/api'; //URI scheme + host + main path 
var authHostPath = 'http://localhost:5200/';
export var API = (function () {
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
export var AppHeaders = (function () {
    function AppHeaders() {
    }
    Object.defineProperty(AppHeaders, "HEADERS", {
        get: function () {
            /** Set content type */
            var headers = new Headers({ 'Content-Type': 'application/json' });
            headers.append('Accept', 'application/json');
            /** Set token if available */
            var token = sessionStorage.getItem("authorizationData"); //localStorage
            if (token !== "" && token !== '""') {
                headers.append('Authorization', 'Bearer ' + token);
            }
            return headers;
        },
        enumerable: true,
        configurable: true
    });
    return AppHeaders;
}());
export var AuthHeaders = (function () {
    function AuthHeaders() {
    }
    Object.defineProperty(AuthHeaders, "HEADERS", {
        get: function () {
            /** Set content type for auth*/
            var headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
            return headers;
        },
        enumerable: true,
        configurable: true
    });
    return AuthHeaders;
}());
//# sourceMappingURL=C:/Frame/Frame/src/FrameUI/src/app/app.settings.js.map