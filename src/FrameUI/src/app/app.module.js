"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
// ng
var core_1 = require('@angular/core');
var platform_browser_1 = require('@angular/platform-browser');
var forms_1 = require('@angular/forms');
var http_1 = require('@angular/http');
var common_1 = require('@angular/common');
// 3rd party
var primeng_1 = require('primeng/primeng');
// custom components
var app_component_1 = require('./app.component');
var home_1 = require('./home/home');
var account_1 = require('./account/account');
var login_1 = require('./account/login');
var register_1 = require('./account/register');
var app_routes_1 = require('./app.routes');
// custom services
var dataService_1 = require('./services/dataService');
var membershipService_1 = require('./services/membershipService');
var notificationService_1 = require('./services/notificationService');
var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            entryComponents: [
                login_1.Login,
                register_1.Register
            ],
            declarations: [
                app_component_1.AppComponent,
                home_1.Home,
                account_1.Account,
                login_1.Login,
                register_1.Register
            ],
            imports: [
                app_routes_1.appRouting,
                platform_browser_1.BrowserModule,
                forms_1.FormsModule,
                http_1.HttpModule,
                primeng_1.DialogModule,
                primeng_1.ButtonModule,
                primeng_1.CheckboxModule,
                primeng_1.InputTextModule,
                primeng_1.PasswordModule,
                primeng_1.MessagesModule,
                primeng_1.MenuModule,
                primeng_1.MenubarModule,
                primeng_1.ToolbarModule
            ],
            providers: [
                { provide: common_1.LocationStrategy, useClass: common_1.PathLocationStrategy },
                dataService_1.DataService,
                membershipService_1.MembershipService,
                notificationService_1.NotificationService
            ],
            bootstrap: [
                app_component_1.AppComponent
            ]
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
