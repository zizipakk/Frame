var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
export var Home = (function () {
    function Home(store) {
        this.store = store;
        this.subscriptions = new Array();
    }
    Home.prototype.ngOnInit = function () {
        var _this = this;
        this.subscriptions.push(this.store.select(function (s) { return s.UserReducer; }).subscribe(function (user) { _this.user = user; }));
    };
    Home.prototype.ngOnDestroy = function () {
        this.subscriptions.forEach(function (sub) { return sub.unsubscribe(); });
    };
    Home.prototype.isUserLoggedIn = function () {
        return this.user.isAuthorized;
    };
    Home = __decorate([
        Component({
            selector: 'home',
            templateUrl: 'home.html',
        }), 
        __metadata('design:paramtypes', [Store])
    ], Home);
    return Home;
}());
//# sourceMappingURL=C:/Frame/Frame/src/FrameUI/src/app/home/home.js.map