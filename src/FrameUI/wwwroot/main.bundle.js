webpackJsonp([1,4],{

/***/ 119:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__app_settings__ = __webpack_require__(233);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__dataService__ = __webpack_require__(358);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__models_openIdConnectRequest__ = __webpack_require__(538);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MembershipService; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




/**
    A class to manage user authentication
    uses local storage to save user authentication cookies
    OpenID and tokens are persist in local store
*/
var MembershipService = (function () {
    function MembershipService(dataService) {
        this.dataService = dataService;
        this.idAction = 'connect';
        this.idLogin = __WEBPACK_IMPORTED_MODULE_1__app_settings__["a" /* API */].AUTH + this.idAction + '/token';
        this.idRegister = __WEBPACK_IMPORTED_MODULE_1__app_settings__["a" /* API */].AUTH + this.idAction + '/register';
        this.idLogout = __WEBPACK_IMPORTED_MODULE_1__app_settings__["a" /* API */].AUTH + this.idAction + '/logoff';
        this.storage = sessionStorage;
        if (this.retrieve("IsAuthorized") !== "") {
            this.HasAdminRole = this.retrieve("HasAdminRole");
            this.IsAuthorized = this.retrieve("IsAuthorized");
            this.UserName = this.retrieve("UserName");
        }
    }
    /** Read store */
    MembershipService.prototype.retrieve = function (key) {
        var item = this.storage.getItem(key);
        if (item && item !== 'undefined') {
            return JSON.parse(item);
        }
        return;
    };
    /** Write store */
    MembershipService.prototype.store = function (key, value) {
        this.storage.setItem(key, JSON.stringify(value));
    };
    MembershipService.prototype.register = function (newUser) {
        this.dataService.set(this.idLogout);
        return this.dataService.post(JSON.stringify(newUser));
    };
    MembershipService.prototype.encodeQueryData = function (data) {
        var ret = [];
        for (var d in data)
            ret.push(encodeURI(d + '=' + data[d]));
        return ret.join('&');
    };
    /** IdentityServer4 endpont use only get method */
    MembershipService.prototype.login = function (creds) {
        this.resetAuthorizationData();
        var grant_type = "password";
        var nonce = "N" + Math.random() + "" + Date.now();
        var offlineaccess = creds.rememberLogin ? " offlineaccess" : "";
        var scope = "openid profile roles" + offlineaccess;
        // TODO: redux store & state ?
        this.store("authNonce", nonce);
        var model = new __WEBPACK_IMPORTED_MODULE_3__models_openIdConnectRequest__["a" /* OpenIdConnectRequest */]();
        model.grant_type = grant_type;
        model.nonce = nonce;
        model.username = creds.email;
        model.password = creds.password;
        model.scope = scope;
        this.dataService.set(this.idLogin);
        return this.dataService.post(this.encodeQueryData(model));
    };
    MembershipService.prototype.loginCallback = function (result) {
        console.log("BEGIN AuthorizedCallback, clear old data");
        this.resetAuthorizationData();
        console.log(result);
        console.log("AuthorizedCallback created, begin token validation");
        var dataIdToken = this.getDataFromToken(result.id_token); // more types
        console.log(dataIdToken);
        if (!dataIdToken || dataIdToken.nonce !== this.retrieve("authNonce")) {
            console.log("AuthorizedCallback incorrect nonce");
            this.resetAuthorizationData();
        }
        else {
            this.store("authNonce", "");
            this.store("authStateControl", "");
            console.log("AuthorizedCallback state and nonce validated, returning access token");
            this.setAuthorizationData(result.access_token, result.id_token, dataIdToken);
        }
    };
    MembershipService.prototype.setAuthorizationData = function (token, id_token, data) {
        console.log(token);
        console.log(id_token);
        console.log("storing to storage, getting the roles");
        this.store("authorizationData", token);
        this.store("authorizationDataIdToken", id_token);
        this.IsAuthorized = true;
        this.store("IsAuthorized", true);
        if (data.role instanceof Array) {
            for (var i = 0; i < data.role.length; i++) {
                console.log("Role: " + data.role[i]);
                if (data.role[i].toUpperCase() === "ADMIN") {
                    this.HasAdminRole = true;
                    this.store("HasAdminRole", true);
                }
            }
        }
        else {
            console.log("Role: " + data.role);
            if (data.role.toUpperCase() === "ADMIN") {
                this.HasAdminRole = true;
                this.store("HasAdminRole", true);
            }
        }
        if (data.username) {
            console.log("User: " + data.username);
            this.UserName = data.username;
            this.store("UserName", data.username);
        }
    };
    MembershipService.prototype.resetAuthorizationData = function () {
        this.IsAuthorized = false;
        this.HasAdminRole = false;
        this.store("authorizationData", "");
        this.store("authorizationDataIdToken", "");
        this.store("HasAdminRole", false);
        this.store("IsAuthorized", false);
        this.UserName = '';
        this.store("UserName", '');
    };
    // TODO
    // getUserData() {
    //     this.dataService.set(this.accountInfo);
    //     return this.dataService.get();
    // }
    MembershipService.prototype.urlBase64Decode = function (str) {
        var output = str.replace('-', '+').replace('_', '/');
        switch (output.length % 4) {
            case 0:
                break;
            case 2:
                output += '==';
                break;
            case 3:
                output += '=';
                break;
            default:
                throw 'Illegal base64url string!';
        }
        return window.atob(output);
    };
    MembershipService.prototype.getDataFromToken = function (token) {
        var data = {};
        if (typeof token !== 'undefined') {
            var encoded = token.split('.')[1];
            data = JSON.parse(this.urlBase64Decode(encoded));
        }
        return data;
    };
    MembershipService.prototype.logout = function () {
        var id_token_hint = this.retrieve("authorizationDataIdToken");
        this.dataService.set(this.idLogout);
        //return this.dataService.post("id_token_hint=" + id_token_hint);
        return this.dataService.post();
    };
    MembershipService.prototype.logoutCallback = function (result) {
        console.log("BEGIN logoutCallback, clear auth data");
        this.resetAuthorizationData();
    };
    MembershipService = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(), 
        __metadata('design:paramtypes', [(typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_2__dataService__["a" /* DataService */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_2__dataService__["a" /* DataService */]) === 'function' && _a) || Object])
    ], MembershipService);
    return MembershipService;
    var _a;
}());
//# sourceMappingURL=c:/FRAME/Frame/src/FrameUI/src/app/services/membershipService.js.map

/***/ }),

/***/ 166:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return NotificationService; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var NotificationService = (function () {
    function NotificationService() {
        this.notifier = alertify;
    }
    NotificationService.prototype.printSuccessMessage = function (message) {
        this.notifier.success(message);
    };
    NotificationService.prototype.printErrorMessage = function (message) {
        this.notifier.error(message);
    };
    NotificationService.prototype.printConfirmationDialog = function (message, okCallback) {
        this.notifier.confirm(message, function (e) {
            if (e) {
                okCallback();
            }
            else {
            }
        });
    };
    NotificationService.prototype.handleError = function (error, callback) {
        console.log(error);
        if (error.status == 403) {
            this.printErrorMessage('Forbidden');
        }
        else if (error.status == 401) {
            if (callback) {
                callback();
            }
            this.printErrorMessage('Unauthorized');
        }
    };
    NotificationService = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(), 
        __metadata('design:paramtypes', [])
    ], NotificationService);
    return NotificationService;
}());
//# sourceMappingURL=c:/FRAME/Frame/src/FrameUI/src/app/services/notificationService.js.map

/***/ }),

/***/ 233:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_http__ = __webpack_require__(219);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return API; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return AppHeaders; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return AuthHeaders; });

// TODO: better get this from unauth API, and put in redux store 
var apiHostPath = 'http://localhost:5200/api'; //URI scheme + host + main path 
var authHostPath = 'http://localhost:5200/';
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
var AppHeaders = (function () {
    function AppHeaders() {
    }
    Object.defineProperty(AppHeaders, "HEADERS", {
        get: function () {
            /** Set content type */
            var headers = new __WEBPACK_IMPORTED_MODULE_0__angular_http__["b" /* Headers */]({ 'Content-Type': 'application/json' });
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
var AuthHeaders = (function () {
    function AuthHeaders() {
    }
    Object.defineProperty(AuthHeaders, "HEADERS", {
        get: function () {
            /** Set content type for auth*/
            var headers = new __WEBPACK_IMPORTED_MODULE_0__angular_http__["b" /* Headers */]({ 'Content-Type': 'application/x-www-form-urlencoded' });
            return headers;
        },
        enumerable: true,
        configurable: true
    });
    return AuthHeaders;
}());
//# sourceMappingURL=c:/FRAME/Frame/src/FrameUI/src/app/app.settings.js.map

/***/ }),

/***/ 354:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Account; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var Account = (function () {
    function Account() {
    }
    Account = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'account',
            template: __webpack_require__(774)
        }), 
        __metadata('design:paramtypes', [])
    ], Account);
    return Account;
}());
//# sourceMappingURL=c:/FRAME/Frame/src/FrameUI/src/app/account/account.js.map

/***/ }),

/***/ 355:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__models_user__ = __webpack_require__(541);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__services_membershipService__ = __webpack_require__(119);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__services_notificationService__ = __webpack_require__(166);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Login; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var Login = (function () {
    function Login(router, membershipService, notificationService) {
        this.router = router;
        this.membershipService = membershipService;
        this.notificationService = notificationService;
        /** primeng show/hide prop */
        this.display = false;
        this.user = new __WEBPACK_IMPORTED_MODULE_2__models_user__["a" /* LoginInputModel */]({ email: '', password: '', rememberLogin: false });
    }
    /** ng event */
    Login.prototype.ngAfterViewInit = function () {
        this.display = true;
    };
    /** primeng event */
    Login.prototype.onAfterHide = function (event) {
        this.navigateBack();
    };
    /** custom events */
    Login.prototype.onClose = function () {
        this.display = false;
        this.navigateBack();
    };
    Login.prototype.navigateBack = function () {
        this.router.navigate(['/']);
    };
    Login.prototype.login = function () {
        var _this = this;
        this.membershipService.login(this.user)
            .subscribe(function (res) {
            _this.membershipService.loginCallback(res);
            _this.notificationService.printSuccessMessage('Welcome back ' + _this.user.email + '!');
            _this.navigateBack();
        }, function (error) {
            console.error('Error: ' + error);
            _this.notificationService.handleError(error, _this.membershipService.resetAuthorizationData);
            _this.notificationService.printErrorMessage(error);
        }, function () { });
    };
    ;
    Login = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'login-modal',
            template: __webpack_require__(775),
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["Router"] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__angular_router__["Router"]) === 'function' && _a) || Object, (typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_3__services_membershipService__["a" /* MembershipService */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_3__services_membershipService__["a" /* MembershipService */]) === 'function' && _b) || Object, (typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_4__services_notificationService__["a" /* NotificationService */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_4__services_notificationService__["a" /* NotificationService */]) === 'function' && _c) || Object])
    ], Login);
    return Login;
    var _a, _b, _c;
}());
//# sourceMappingURL=c:/FRAME/Frame/src/FrameUI/src/app/account/login.js.map

/***/ }),

/***/ 356:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__models_registration__ = __webpack_require__(540);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__models_operationResult__ = __webpack_require__(539);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__services_membershipService__ = __webpack_require__(119);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__services_notificationService__ = __webpack_require__(166);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Register; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var Register = (function () {
    function Register(membershipService, notificationService, router) {
        this.membershipService = membershipService;
        this.notificationService = notificationService;
        this.router = router;
        /** primeng show/hide prop */
        this.display = false;
        this.newUser = new __WEBPACK_IMPORTED_MODULE_2__models_registration__["a" /* Registration */]('', '', '');
    }
    /** ng event */
    Register.prototype.ngAfterViewInit = function () {
        this.display = true;
    };
    /** primeng event */
    Register.prototype.onAfterHide = function (event) {
        this.navigateBack();
    };
    /** custom events */
    Register.prototype.onClose = function () {
        this.display = false;
        this.navigateBack();
    };
    Register.prototype.navigateBack = function () {
        this.router.navigate(['/account/login']);
    };
    Register.prototype.register = function () {
        var _this = this;
        var registrationResult = new __WEBPACK_IMPORTED_MODULE_3__models_operationResult__["a" /* OperationResult */](false, '');
        this.membershipService.register(this.newUser)
            .subscribe(function (res) {
            registrationResult.Succeeded = res.Succeeded;
            registrationResult.Message = res.Message;
        }, function (error) { return console.error('Error: ' + error); }, function () {
            if (registrationResult.Succeeded) {
                _this.notificationService.printSuccessMessage('Dear ' + _this.newUser.Username + ', please login with your credentials');
                _this.router.navigate(['/account/login']);
            }
            else {
                _this.notificationService.printErrorMessage(registrationResult.Message);
            }
        });
    };
    ;
    Register = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'register-modal',
            template: __webpack_require__(776),
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_4__services_membershipService__["a" /* MembershipService */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_4__services_membershipService__["a" /* MembershipService */]) === 'function' && _a) || Object, (typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_5__services_notificationService__["a" /* NotificationService */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_5__services_notificationService__["a" /* NotificationService */]) === 'function' && _b) || Object, (typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["Router"] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__angular_router__["Router"]) === 'function' && _c) || Object])
    ], Register);
    return Register;
    var _a, _b, _c;
}());
//# sourceMappingURL=c:/FRAME/Frame/src/FrameUI/src/app/account/register.js.map

/***/ }),

/***/ 357:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__services_membershipService__ = __webpack_require__(119);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Home; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var Home = (function () {
    function Home(membershipService) {
        this.membershipService = membershipService;
    }
    Home.prototype.ngOnInit = function () {
    };
    Home.prototype.isUserLoggedIn = function () {
        return this.membershipService.IsAuthorized;
    };
    Home = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'home',
            template: __webpack_require__(778),
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__services_membershipService__["a" /* MembershipService */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__services_membershipService__["a" /* MembershipService */]) === 'function' && _a) || Object])
    ], Home);
    return Home;
    var _a;
}());
//# sourceMappingURL=c:/FRAME/Frame/src/FrameUI/src/app/home/home.js.map

/***/ }),

/***/ 358:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__(219);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_router__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__app_settings__ = __webpack_require__(233);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_map__ = __webpack_require__(782);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_map__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DataService; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






//A generic class used to GET/PUT/POST/DELETE over HTTP to server
var DataService = (function () {
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
        var uri = this.baseUri + this.pageSizeUri;
        return this.http.get(uri)
            .map(function (response) { return (response); });
    };
    DataService.prototype.post = function (data, mapJson) {
        if (mapJson === void 0) { mapJson = true; }
        var postHeaders = data && data.indexOf('grant_type') !== -1 ? { headers: __WEBPACK_IMPORTED_MODULE_3__app_settings__["b" /* AuthHeaders */].HEADERS } : { headers: __WEBPACK_IMPORTED_MODULE_3__app_settings__["c" /* AppHeaders */].HEADERS };
        var response = this.http.post(this.baseUri, data, postHeaders);
        if (mapJson)
            return response.map(function (r) { return r.json(); });
        return response;
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
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(), 
        __metadata('design:paramtypes', [(typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_http__["c" /* Http */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__angular_http__["c" /* Http */]) === 'function' && _a) || Object, (typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_2__angular_router__["Router"] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_2__angular_router__["Router"]) === 'function' && _b) || Object])
    ], DataService);
    return DataService;
    var _a, _b;
}());
//# sourceMappingURL=c:/FRAME/Frame/src/FrameUI/src/app/services/dataService.js.map

/***/ }),

/***/ 415:
/***/ (function(module, exports) {

function webpackEmptyContext(req) {
	throw new Error("Cannot find module '" + req + "'.");
}
webpackEmptyContext.keys = function() { return []; };
webpackEmptyContext.resolve = webpackEmptyContext;
module.exports = webpackEmptyContext;
webpackEmptyContext.id = 415;


/***/ }),

/***/ 416:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__polyfills__ = __webpack_require__(543);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__vendor__ = __webpack_require__(544);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__vendor___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__vendor__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_platform_browser_dynamic__ = __webpack_require__(506);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__environments_environment__ = __webpack_require__(542);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__app_app_module__ = __webpack_require__(536);






if (__WEBPACK_IMPORTED_MODULE_4__environments_environment__["a" /* environment */].production) {
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__angular_core__["enableProdMode"])();
}
__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_5__app_app_module__["a" /* AppModule */]).catch(function (err) { return console.error(err); });
//# sourceMappingURL=c:/FRAME/Frame/src/FrameUI/src/main.js.map

/***/ }),

/***/ 535:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__services_membershipService__ = __webpack_require__(119);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__services_notificationService__ = __webpack_require__(166);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var AppComponent = (function () {
    function AppComponent(membershipService, notificationService, router) {
        this.membershipService = membershipService;
        this.notificationService = notificationService;
        this.router = router;
        this.userName = this.isUserLoggedIn() ? this.membershipService.UserName : '';
    }
    AppComponent.prototype.ngOnInit = function () {
        this.refreshMenu();
    };
    AppComponent.prototype.navigateBack = function () {
        this.router.navigate(['/']);
    };
    AppComponent.prototype.isUserLoggedIn = function () {
        return this.membershipService.IsAuthorized;
    };
    AppComponent.prototype.refreshMenu = function () {
        var _this = this;
        this.menuItems =
            [{
                    label: 'Home',
                    icon: '',
                    routerLink: ['/'],
                    command: function (event) { },
                    items: null
                }];
        if (!this.isUserLoggedIn()) {
            this.menuItems.push({
                label: 'Log In',
                icon: 'fa-unlock-alt fa-fw',
                routerLink: ['/account/login'],
                command: function (event) { },
                items: null
            });
        }
        else {
            this.menuItems.push({
                label: this.userName,
                icon: 'fa-user',
                routerLink: null,
                command: function (event) { },
                items: [
                    { label: ' Profile', icon: 'fa-fw fa-user', routerLink: null, command: function (event) { } },
                    { label: ' Inbox', icon: 'fa-fw fa-envelope', routerLink: null, command: function (event) { } },
                    { label: ' Settings', icon: 'fa-fw fa-gear', routerLink: null, command: function (event) { } },
                    { label: ' Log Out', icon: 'fa-fw fa-lock', routerLink: null, command: function (event) { _this.logOut(); } }
                ]
            });
        }
    };
    AppComponent.prototype.logOut = function () {
        var _this = this;
        this.membershipService.logout()
            .subscribe(function (res) {
            _this.membershipService.logoutCallback(res);
            _this.notificationService.printSuccessMessage('By ' + _this.userName + '!');
        }, function (error) {
            console.error('Error: ' + error);
            _this.notificationService.handleError(error, _this.membershipService.resetAuthorizationData);
            _this.notificationService.printErrorMessage(error);
        }, function () { _this.refreshMenu(); });
    };
    AppComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'app-root',
            template: __webpack_require__(777),
            styles: [__webpack_require__(773)]
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_2__services_membershipService__["a" /* MembershipService */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_2__services_membershipService__["a" /* MembershipService */]) === 'function' && _a) || Object, (typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_3__services_notificationService__["a" /* NotificationService */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_3__services_notificationService__["a" /* NotificationService */]) === 'function' && _b) || Object, (typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["Router"] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__angular_router__["Router"]) === 'function' && _c) || Object])
    ], AppComponent);
    return AppComponent;
    var _a, _b, _c;
}());
//# sourceMappingURL=c:/FRAME/Frame/src/FrameUI/src/app/app.component.js.map

/***/ }),

/***/ 536:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__ = __webpack_require__(116);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_forms__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_http__ = __webpack_require__(219);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__angular_common__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_primeng_primeng__ = __webpack_require__(770);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_primeng_primeng___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_primeng_primeng__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__app_component__ = __webpack_require__(535);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__home_home__ = __webpack_require__(357);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__account_account__ = __webpack_require__(354);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__account_login__ = __webpack_require__(355);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__account_register__ = __webpack_require__(356);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__app_routes__ = __webpack_require__(537);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__services_dataService__ = __webpack_require__(358);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__services_membershipService__ = __webpack_require__(119);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__services_notificationService__ = __webpack_require__(166);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};















var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
            entryComponents: [
                __WEBPACK_IMPORTED_MODULE_9__account_login__["a" /* Login */],
                __WEBPACK_IMPORTED_MODULE_10__account_register__["a" /* Register */]
            ],
            declarations: [
                __WEBPACK_IMPORTED_MODULE_6__app_component__["a" /* AppComponent */],
                __WEBPACK_IMPORTED_MODULE_7__home_home__["a" /* Home */],
                __WEBPACK_IMPORTED_MODULE_8__account_account__["a" /* Account */],
                __WEBPACK_IMPORTED_MODULE_9__account_login__["a" /* Login */],
                __WEBPACK_IMPORTED_MODULE_10__account_register__["a" /* Register */]
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_11__app_routes__["a" /* appRouting */],
                __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__["BrowserModule"],
                __WEBPACK_IMPORTED_MODULE_2__angular_forms__["FormsModule"],
                __WEBPACK_IMPORTED_MODULE_3__angular_http__["a" /* HttpModule */],
                __WEBPACK_IMPORTED_MODULE_5_primeng_primeng__["DialogModule"],
                __WEBPACK_IMPORTED_MODULE_5_primeng_primeng__["ButtonModule"],
                __WEBPACK_IMPORTED_MODULE_5_primeng_primeng__["CheckboxModule"],
                __WEBPACK_IMPORTED_MODULE_5_primeng_primeng__["InputTextModule"],
                __WEBPACK_IMPORTED_MODULE_5_primeng_primeng__["PasswordModule"],
                __WEBPACK_IMPORTED_MODULE_5_primeng_primeng__["MessagesModule"],
                __WEBPACK_IMPORTED_MODULE_5_primeng_primeng__["MenuModule"],
                __WEBPACK_IMPORTED_MODULE_5_primeng_primeng__["MenubarModule"],
                __WEBPACK_IMPORTED_MODULE_5_primeng_primeng__["ToolbarModule"]
            ],
            providers: [
                { provide: __WEBPACK_IMPORTED_MODULE_4__angular_common__["LocationStrategy"], useClass: __WEBPACK_IMPORTED_MODULE_4__angular_common__["PathLocationStrategy"] },
                __WEBPACK_IMPORTED_MODULE_12__services_dataService__["a" /* DataService */],
                __WEBPACK_IMPORTED_MODULE_13__services_membershipService__["a" /* MembershipService */],
                __WEBPACK_IMPORTED_MODULE_14__services_notificationService__["a" /* NotificationService */]
            ],
            bootstrap: [
                __WEBPACK_IMPORTED_MODULE_6__app_component__["a" /* AppComponent */]
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], AppModule);
    return AppModule;
}());
//# sourceMappingURL=c:/FRAME/Frame/src/FrameUI/src/app/app.module.js.map

/***/ }),

/***/ 537:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_router__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__home_home__ = __webpack_require__(357);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__account_account__ = __webpack_require__(354);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__account_login__ = __webpack_require__(355);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__account_register__ = __webpack_require__(356);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return appRouting; });





var appRoutes = [
    { path: '', component: __WEBPACK_IMPORTED_MODULE_1__home_home__["a" /* Home */] },
    {
        path: 'account', component: __WEBPACK_IMPORTED_MODULE_2__account_account__["a" /* Account */],
        children: [
            {
                path: 'login',
                component: __WEBPACK_IMPORTED_MODULE_3__account_login__["a" /* Login */]
            },
            {
                path: 'register',
                component: __WEBPACK_IMPORTED_MODULE_4__account_register__["a" /* Register */]
            }
        ]
    },
    { path: '**', redirectTo: '/', pathMatch: 'full' } // at last ...
];
var appRouting = __WEBPACK_IMPORTED_MODULE_0__angular_router__["RouterModule"].forRoot(appRoutes);
//# sourceMappingURL=c:/FRAME/Frame/src/FrameUI/src/app/app.routes.js.map

/***/ }),

/***/ 538:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return OpenIdConnectRequest; });
var OpenIdConnectRequest = (function () {
    function OpenIdConnectRequest(model) {
        if (model) {
            this.accesstoken = model.accesstoken;
            this.assertion = model.assertion;
            this.clientassertion = model.clientassertion;
            this.clientassertiontype = model.clientassertiontype;
            this.client_id = model.client_id;
            this.clientsecret = model.clientsecret;
            this.code = model.code;
            this.codechallenge = model.codechallenge;
            this.codechallengemethod = model.codechallengemethod;
            this.codeverifier = model.codeverifier;
            this.grant_type = model.grant_type;
            this.idtokenhint = model.idtokenhint;
            this.nonce = model.nonce;
            this.password = model.password;
            this.postlogoutredirecturi = model.postlogoutredirecturi;
            this.prompt = model.prompt;
            this.redirecturi = model.redirecturi;
            this.refreshtoken = model.refreshtoken;
            this.request = model.request;
            this.requestid = model.requestid;
            this.requesturi = model.requesturi;
            this.resource = model.resource;
            this.responsemode = model.responsemode;
            this.responsetype = model.responsetype;
            this.scope = model.scope;
            this.state = model.state;
            this.token = model.token;
            this.tokentypehint = model.tokentypehint;
            this.username = model.username;
        }
    }
    return OpenIdConnectRequest;
}());
//# sourceMappingURL=c:/FRAME/Frame/src/FrameUI/src/app/models/openIdConnectRequest.js.map

/***/ }),

/***/ 539:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return OperationResult; });
var OperationResult = (function () {
    function OperationResult(succeeded, message) {
        this.Succeeded = succeeded;
        this.Message = message;
    }
    return OperationResult;
}());
//# sourceMappingURL=c:/FRAME/Frame/src/FrameUI/src/app/models/operationResult.js.map

/***/ }),

/***/ 540:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Registration; });
/* unused harmony export TestArray */
var Registration = (function () {
    function Registration(username, password, email) {
        this.Username = username;
        this.Password = password;
        this.Email = email;
    }
    return Registration;
}());
var TestArray = ([
    { Id: "name", Value: "Jack" },
    { Id: "desc", Value: "The Ripper" },
    { Id: "dist", Value: "10" }
]);
var TestName = TestArray.filter(function (m) { return m.Id == 'name'; })[0].Value;
//# sourceMappingURL=c:/FRAME/Frame/src/FrameUI/src/app/models/registration.js.map

/***/ }),

/***/ 541:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LoginInputModel; });
var LoginInputModel = (function () {
    function LoginInputModel(model) {
        this.email = model.email;
        this.password = model.password;
        this.rememberLogin = model.rememberLogin;
    }
    return LoginInputModel;
}());
//# sourceMappingURL=c:/FRAME/Frame/src/FrameUI/src/app/models/user.js.map

/***/ }),

/***/ 542:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return environment; });
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.
var environment = {
    production: false
};
//# sourceMappingURL=c:/FRAME/Frame/src/FrameUI/src/environments/environment.js.map

/***/ }),

/***/ 543:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_ie_shim__ = __webpack_require__(709);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_ie_shim___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_ie_shim__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_core_js_es6_symbol__ = __webpack_require__(558);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_core_js_es6_symbol___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_core_js_es6_symbol__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_core_js_es6_object__ = __webpack_require__(551);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_core_js_es6_object___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_core_js_es6_object__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_core_js_es6_function__ = __webpack_require__(547);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_core_js_es6_function___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_core_js_es6_function__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_core_js_es6_parse_int__ = __webpack_require__(553);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_core_js_es6_parse_int___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_core_js_es6_parse_int__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_core_js_es6_parse_float__ = __webpack_require__(552);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_core_js_es6_parse_float___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_core_js_es6_parse_float__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_core_js_es6_number__ = __webpack_require__(550);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_core_js_es6_number___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_core_js_es6_number__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_core_js_es6_math__ = __webpack_require__(549);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_core_js_es6_math___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7_core_js_es6_math__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_core_js_es6_string__ = __webpack_require__(557);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_core_js_es6_string___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_8_core_js_es6_string__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_core_js_es6_date__ = __webpack_require__(546);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_core_js_es6_date___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_9_core_js_es6_date__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_core_js_es6_array__ = __webpack_require__(545);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_core_js_es6_array___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_10_core_js_es6_array__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11_core_js_es6_regexp__ = __webpack_require__(555);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11_core_js_es6_regexp___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_11_core_js_es6_regexp__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12_core_js_es6_map__ = __webpack_require__(548);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12_core_js_es6_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_12_core_js_es6_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13_core_js_es6_set__ = __webpack_require__(556);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13_core_js_es6_set___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_13_core_js_es6_set__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14_core_js_es6_weak_map__ = __webpack_require__(560);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14_core_js_es6_weak_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_14_core_js_es6_weak_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15_core_js_es6_weak_set__ = __webpack_require__(561);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15_core_js_es6_weak_set___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_15_core_js_es6_weak_set__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16_core_js_es6_typed__ = __webpack_require__(559);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16_core_js_es6_typed___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_16_core_js_es6_typed__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17_core_js_es6_reflect__ = __webpack_require__(554);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17_core_js_es6_reflect___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_17_core_js_es6_reflect__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18_core_js_es7_reflect__ = __webpack_require__(562);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18_core_js_es7_reflect___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_18_core_js_es7_reflect__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19_zone_js_dist_zone__ = __webpack_require__(808);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19_zone_js_dist_zone___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_19_zone_js_dist_zone__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20_ts_helpers__ = __webpack_require__(796);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20_ts_helpers___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_20_ts_helpers__);





















//# sourceMappingURL=c:/FRAME/Frame/src/FrameUI/src/polyfills.js.map

/***/ }),

/***/ 544:
/***/ (function(module, exports) {

//# sourceMappingURL=c:/FRAME/Frame/src/FrameUI/src/vendor.js.map

/***/ }),

/***/ 773:
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ 774:
/***/ (function(module, exports) {

module.exports = "<div class=\"container\">\r\n\r\n    <!--necessary in all parent view-->\r\n    <router-outlet></router-outlet>\r\n\r\n</div>"

/***/ }),

/***/ 775:
/***/ (function(module, exports) {

module.exports = "<p-dialog [(visible)]=\"display\" width=\"600\" modal=\"true\" responsive=\"true\" (onAfterHide)=\"onAfterHide($event)\"> \r\n    <header>\r\n        <h1>\r\n            <span class=\"fa-stack fa-1x\">\r\n                <i class=\"fa fa-circle fa-stack-2x color-blue\"></i>\r\n                <i class=\"fa fa-user fa-stack-1x fa-inverse\"></i>\r\n            </span>Login\r\n        </h1>\r\n    </header>\r\n    <form class=\"ui-g\" #hf=\"ngForm\">\r\n        <div class=\"ui-g-12\">\r\n            <input class=\"ui-g-12\" type=\"text\" pInputText placeholder=\"Username\" [(ngModel)]=\"user.email\"\r\n                    name=\"email\" required #email=\"ngModel\" />\r\n            <div [hidden]=\"email.valid || email.untouched\" class=\"ui-message ui-messages-error ui-corner-all\">\r\n                <i class=\"fa fa-close\"></i> Email is required\r\n            </div>\r\n        </div>\r\n        <div class=\"ui-g-12\">\r\n            <input class=\"ui-g-12\" type=\"password\" pPassword placeholder=\"Password\" [(ngModel)]=\"user.password\"\r\n                    name=\"password\" required #passWord=\"ngModel\" />\r\n            <div [hidden]=\"passWord.valid || passWord.untouched\" class=\"ui-message ui-messages-error ui-corner-all\">\r\n                <i class=\"fa fa-close\"></i> Password is required\r\n            </div>\r\n        </div>\r\n        <div class=\"ui-g-12\">\r\n            <button class=\"ui-g-12\" type=\"button\" pButton [disabled]=\"!hf.form.valid\" (click)=\"login()\" label=\"Sign In\"></button>\r\n            <span class=\"float-right\">\r\n                <a class=\"nav-link\" [routerLink]=\"['/account/register']\"><h4>Register</h4></a>\r\n            </span>\r\n        </div>        \r\n        <div class=\"ui-g-12\">\r\n            <p-checkbox name=\"remember\" [(ngModel)]=\"user.rememberLogin\" binary=\"true\" label=\"Remember me\"></p-checkbox>\r\n        </div>\r\n    </form>\r\n    <footer>\r\n        <div class=\"ui-dialog-buttonpane ui-widget-content ui-helper-clearfix\">\r\n            <button class=\"button-red\" type=\"button\" pButton icon=\"fa-close\" (click)=\"onClose()\" label=\"Cancel\"></button>\r\n        </div>\r\n    </footer> \r\n</p-dialog>\r\n"

/***/ }),

/***/ 776:
/***/ (function(module, exports) {

module.exports = "<p-dialog [(visible)]=\"display\" width=\"600\" modal=\"true\" responsive=\"true\" (onAfterHide)=\"onAfterHide($event)\"> \r\n            <header>\r\n                <h1 class=\"text-center\">\r\n                    <span class=\"fa-stack fa-1x\">\r\n                        <i class=\"fa fa-circle fa-stack-2x color-blue\"></i>\r\n                        <i class=\"fa fa-user-plus fa-stack-1x fa-inverse\"></i>\r\n                    </span>Register\r\n                </h1>\r\n            </header>\r\n            <form class=\"ui-g\" #hf=\"ngForm\">\r\n                <div class=\"ui-g-12\">\r\n                    <input class=\"ui-g-12\" type=\"text\" pInputText placeholder=\"Username\" [(ngModel)]=\"newUser.Username\"\r\n                            name=\"username\" required #username=\"ngModel\">\r\n                    <div [hidden]=\"username.valid || username.untouched\" class=\"ui-message ui-messages-error ui-corner-all\">\r\n                        <i class=\"fa fa-close\"></i> Username is required\r\n                    </div>\r\n                </div>\r\n                <div class=\"ui-g-12\">\r\n                    <input class=\"ui-g-12\" type=\"email\" pInputText placeholder=\"Email\" [(ngModel)]=\"newUser.Email\"\r\n                            name=\"email\" required #email=\"ngModel\">\r\n                    <div [hidden]=\"email.valid || email.untouched\" class=\"ui-message ui-messages-error ui-corner-all\">\r\n                        <i class=\"fa fa-close\"></i> Email is required\r\n                    </div>\r\n                </div>\r\n                <div class=\"ui-g-12\">\r\n                    <input class=\"ui-g-12\" type=\"password\" pPassword placeholder=\"Password\" [(ngModel)]=\"newUser.Password\"\r\n                            name=\"password\" required #password=\"ngModel\">\r\n                    <div [hidden]=\"password.valid || password.untouched\" class=\"ui-message ui-messages-error ui-corner-all\">\r\n                        <i class=\"fa fa-close\"></i> Password is required\r\n                    </div>\r\n                </div>\r\n                <div class=\"ui-g-12\">\r\n                    <button class=\"btn btn-primary btn-lg btn-block\" (click)=\"register()\" [disabled]=\"!hf.form.valid\">Register</button>\r\n                </div>\r\n            </form>\r\n            <footer>\r\n                <div class=\"ui-dialog-buttonpane ui-widget-content ui-helper-clearfix\">\r\n                    <button class=\"button-red\" type=\"button\" pButton icon=\"fa-close\" [routerLink]=\"['/account/login']\" label=\"Cancel\"></button>\r\n                </div>\r\n            </footer> \r\n</p-dialog>"

/***/ }),

/***/ 777:
/***/ (function(module, exports) {

module.exports = "<p-toolbar name=\"menuOptions\">\n    <div class=\"ui-toolbar-group-left\">\n        <img src=\"favicon.ico\">\n    </div>\n    <div class=\"ui-toolbar-group-left\">\n        <p-menubar [model]=\"menuItems\"></p-menubar>\n    </div>\n    <div class=\"ui-toolbar-group-right\" *ngIf=\"!isUserLoggedIn()\">\n        <input type=\"text\" pInputText placeholder=\"Search\">\n        <button class=\"button-red\" type=\"button\" pButton icon=\"fa-search\" label=\"Search\"></button>\n    </div>\n</p-toolbar>\n\n<router-outlet></router-outlet>\n"

/***/ }),

/***/ 778:
/***/ (function(module, exports) {

module.exports = "<div id=\"page-wrapper\">\r\n    <div *ngIf=\"isUserLoggedIn()\" class=\"container-fluid\">\r\n        <!-- Page Heading -->\r\n        <div class=\"row\">\r\n            <div class=\"col-lg-12\">\r\n                <h1 class=\"page-header\">\r\n                    <br />\r\n                    Dashboard <small>Statistics Overview</small>\r\n                </h1>\r\n                <ol class=\"breadcrumb\">\r\n                    <li class=\"active\">\r\n                        <i class=\"fa fa-dashboard\"></i> Dashboard\r\n                    </li>\r\n                </ol>\r\n            </div>\r\n        </div>\r\n        <!-- /.row -->\r\n        <!-- /.row -->\r\n        <div class=\"row\">\r\n            <div class=\"col-lg-3 col-md-6\">\r\n                <div class=\"panel panel-primary\">\r\n                    <div class=\"panel-heading\">\r\n                        <div class=\"row\">\r\n                            <div class=\"col-xs-3\">\r\n                                <i class=\"fa fa-comments fa-5x\"></i>\r\n                            </div>\r\n                            <div class=\"col-xs-9 text-right\">\r\n                                <div class=\"huge\">26</div>\r\n                                <div>New Comments!</div>\r\n                            </div>\r\n                        </div>\r\n                    </div>\r\n                    <a href=\"#\">\r\n                        <div class=\"panel-footer\">\r\n                            <span class=\"pull-left\">View Details</span>\r\n                            <span class=\"pull-right\"><i class=\"fa fa-arrow-circle-right\"></i></span>\r\n                            <div class=\"clearfix\"></div>\r\n                        </div>\r\n                    </a>\r\n                </div>\r\n            </div>\r\n            <div class=\"col-lg-3 col-md-6\">\r\n                <div class=\"panel panel-green\">\r\n                    <div class=\"panel-heading\">\r\n                        <div class=\"row\">\r\n                            <div class=\"col-xs-3\">\r\n                                <i class=\"fa fa-tasks fa-5x\"></i>\r\n                            </div>\r\n                            <div class=\"col-xs-9 text-right\">\r\n                                <div class=\"huge\">12</div>\r\n                                <div>New Tasks!</div>\r\n                            </div>\r\n                        </div>\r\n                    </div>\r\n                    <a href=\"#\">\r\n                        <div class=\"panel-footer\">\r\n                            <span class=\"pull-left\">View Details</span>\r\n                            <span class=\"pull-right\"><i class=\"fa fa-arrow-circle-right\"></i></span>\r\n                            <div class=\"clearfix\"></div>\r\n                        </div>\r\n                    </a>\r\n                </div>\r\n            </div>\r\n            <div class=\"col-lg-3 col-md-6\">\r\n                <div class=\"panel panel-yellow\">\r\n                    <div class=\"panel-heading\">\r\n                        <div class=\"row\">\r\n                            <div class=\"col-xs-3\">\r\n                                <i class=\"fa fa-shopping-cart fa-5x\"></i>\r\n                            </div>\r\n                            <div class=\"col-xs-9 text-right\">\r\n                                <div class=\"huge\">124</div>\r\n                                <div>New Orders!</div>\r\n                            </div>\r\n                        </div>\r\n                    </div>\r\n                    <a href=\"#\">\r\n                        <div class=\"panel-footer\">\r\n                            <span class=\"pull-left\">View Details</span>\r\n                            <span class=\"pull-right\"><i class=\"fa fa-arrow-circle-right\"></i></span>\r\n                            <div class=\"clearfix\"></div>\r\n                        </div>\r\n                    </a>\r\n                </div>\r\n            </div>\r\n            <div class=\"col-lg-3 col-md-6\">\r\n                <div class=\"panel panel-red\">\r\n                    <div class=\"panel-heading\">\r\n                        <div class=\"row\">\r\n                            <div class=\"col-xs-3\">\r\n                                <i class=\"fa fa-support fa-5x\"></i>\r\n                            </div>\r\n                            <div class=\"col-xs-9 text-right\">\r\n                                <div class=\"huge\">13</div>\r\n                                <div>Support Tickets!</div>\r\n                            </div>\r\n                        </div>\r\n                    </div>\r\n                    <a href=\"#\">\r\n                        <div class=\"panel-footer\">\r\n                            <span class=\"pull-left\">View Details</span>\r\n                            <span class=\"pull-right\"><i class=\"fa fa-arrow-circle-right\"></i></span>\r\n                            <div class=\"clearfix\"></div>\r\n                        </div>\r\n                    </a>\r\n                </div>\r\n            </div>\r\n        </div>\r\n        <!-- /.row -->\r\n        <div class=\"row\">\r\n            <div class=\"col-lg-12\">\r\n                <div class=\"panel panel-default\">\r\n                    <div class=\"panel-heading\">\r\n                        <h3 class=\"panel-title\"><i class=\"fa fa-bar-chart-o fa-fw\"></i> Area Chart</h3>\r\n                    </div>\r\n                    <div class=\"panel-body\">\r\n                        <div id=\"morris-area-chart\"></div>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </div>\r\n        <!-- /.row -->\r\n        <div class=\"row\">\r\n            <div class=\"col-lg-4\">\r\n                <div class=\"panel panel-default\">\r\n                    <div class=\"panel-heading\">\r\n                        <h3 class=\"panel-title\"><i class=\"fa fa-long-arrow-right fa-fw\"></i> Donut Chart</h3>\r\n                    </div>\r\n                    <div class=\"panel-body\">\r\n                        <div id=\"morris-donut-chart\"></div>\r\n                        <div class=\"text-right\">\r\n                            <a href=\"#\">View Details <i class=\"fa fa-arrow-circle-right\"></i></a>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n            <div class=\"col-lg-4\">\r\n                <div class=\"panel panel-default\">\r\n                    <div class=\"panel-heading\">\r\n                        <h3 class=\"panel-title\"><i class=\"fa fa-clock-o fa-fw\"></i> Tasks Panel</h3>\r\n                    </div>\r\n                    <div class=\"panel-body\">\r\n                        <div class=\"list-group\">\r\n                            <a href=\"#\" class=\"list-group-item\">\r\n                                <span class=\"badge\">just now</span>\r\n                                <i class=\"fa fa-fw fa-calendar\"></i> Calendar updated\r\n                            </a>\r\n                            <a href=\"#\" class=\"list-group-item\">\r\n                                <span class=\"badge\">4 minutes ago</span>\r\n                                <i class=\"fa fa-fw fa-comment\"></i> Commented on a post\r\n                            </a>\r\n                            <a href=\"#\" class=\"list-group-item\">\r\n                                <span class=\"badge\">23 minutes ago</span>\r\n                                <i class=\"fa fa-fw fa-truck\"></i> Order 392 shipped\r\n                            </a>\r\n                            <a href=\"#\" class=\"list-group-item\">\r\n                                <span class=\"badge\">46 minutes ago</span>\r\n                                <i class=\"fa fa-fw fa-money\"></i> Invoice 653 has been paid\r\n                            </a>\r\n                            <a href=\"#\" class=\"list-group-item\">\r\n                                <span class=\"badge\">1 hour ago</span>\r\n                                <i class=\"fa fa-fw fa-user\"></i> A new user has been added\r\n                            </a>\r\n                            <a href=\"#\" class=\"list-group-item\">\r\n                                <span class=\"badge\">2 hours ago</span>\r\n                                <i class=\"fa fa-fw fa-check\"></i> Completed task: \"pick up dry cleaning\"\r\n                            </a>\r\n                            <a href=\"#\" class=\"list-group-item\">\r\n                                <span class=\"badge\">yesterday</span>\r\n                                <i class=\"fa fa-fw fa-globe\"></i> Saved the world\r\n                            </a>\r\n                            <a href=\"#\" class=\"list-group-item\">\r\n                                <span class=\"badge\">two days ago</span>\r\n                                <i class=\"fa fa-fw fa-check\"></i> Completed task: \"fix error on sales page\"\r\n                            </a>\r\n                        </div>\r\n                        <div class=\"text-right\">\r\n                            <a href=\"#\">View All Activity <i class=\"fa fa-arrow-circle-right\"></i></a>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n            <div class=\"col-lg-4\">\r\n                <div class=\"panel panel-default\">\r\n                    <div class=\"panel-heading\">\r\n                        <h3 class=\"panel-title\"><i class=\"fa fa-money fa-fw\"></i> Transactions Panel</h3>\r\n                    </div>\r\n                    <div class=\"panel-body\">\r\n                        <div class=\"table-responsive\">\r\n                            <table class=\"table table-bordered table-hover table-striped\">\r\n                                <thead>\r\n                                    <tr>\r\n                                        <th>Order #</th>\r\n                                        <th>Order Date</th>\r\n                                        <th>Order Time</th>\r\n                                        <th>Amount (USD)</th>\r\n                                    </tr>\r\n                                </thead>\r\n                                <tbody>\r\n                                    <tr>\r\n                                        <td>3326</td>\r\n                                        <td>10/21/2013</td>\r\n                                        <td>3:29 PM</td>\r\n                                        <td>$321.33</td>\r\n                                    </tr>\r\n                                    <tr>\r\n                                        <td>3325</td>\r\n                                        <td>10/21/2013</td>\r\n                                        <td>3:20 PM</td>\r\n                                        <td>$234.34</td>\r\n                                    </tr>\r\n                                    <tr>\r\n                                        <td>3324</td>\r\n                                        <td>10/21/2013</td>\r\n                                        <td>3:03 PM</td>\r\n                                        <td>$724.17</td>\r\n                                    </tr>\r\n                                    <tr>\r\n                                        <td>3323</td>\r\n                                        <td>10/21/2013</td>\r\n                                        <td>3:00 PM</td>\r\n                                        <td>$23.71</td>\r\n                                    </tr>\r\n                                    <tr>\r\n                                        <td>3322</td>\r\n                                        <td>10/21/2013</td>\r\n                                        <td>2:49 PM</td>\r\n                                        <td>$8345.23</td>\r\n                                    </tr>\r\n                                    <tr>\r\n                                        <td>3321</td>\r\n                                        <td>10/21/2013</td>\r\n                                        <td>2:23 PM</td>\r\n                                        <td>$245.12</td>\r\n                                    </tr>\r\n                                    <tr>\r\n                                        <td>3320</td>\r\n                                        <td>10/21/2013</td>\r\n                                        <td>2:15 PM</td>\r\n                                        <td>$5663.54</td>\r\n                                    </tr>\r\n                                    <tr>\r\n                                        <td>3319</td>\r\n                                        <td>10/21/2013</td>\r\n                                        <td>2:13 PM</td>\r\n                                        <td>$943.45</td>\r\n                                    </tr>\r\n                                </tbody>\r\n                            </table>\r\n                        </div>\r\n                        <div class=\"text-right\">\r\n                            <a href=\"#\">View All Transactions <i class=\"fa fa-arrow-circle-right\"></i></a>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>"

/***/ }),

/***/ 811:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(416);


/***/ })

},[811]);
//# sourceMappingURL=main.bundle.map