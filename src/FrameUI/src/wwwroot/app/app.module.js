var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { DialogModule, ButtonModule, CheckboxModule, InputTextModule, PasswordModule, MessagesModule, MenuModule, MenubarModule, ToolbarModule, GrowlModule, BlockUIModule } from 'primeng/primeng';
import { StoreModule } from '@ngrx/store';
import { UserReducer, NotificationReducer, MessageReducer, BlockerReducer } from './reducers/index';
import { AppComponent } from './app.component';
import { Home } from './home/home';
import { Account } from './account/account';
import { Login } from './account/login';
import { Register } from './account/register';
import { AppRouting } from './app.routes';
import { DataService } from './services/dataService';
import { MembershipService } from './services/membershipService';
import { NotificationService } from './services/notificationService';
export var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        NgModule({
            entryComponents: [
                Login,
                Register
            ],
            declarations: [
                AppComponent,
                Home,
                Account,
                Login,
                Register
            ],
            imports: [
                AppRouting,
                BrowserModule,
                FormsModule,
                HttpModule,
                DialogModule,
                ButtonModule,
                CheckboxModule,
                InputTextModule,
                PasswordModule,
                MessagesModule,
                MenuModule,
                MenubarModule,
                ToolbarModule,
                GrowlModule,
                BlockUIModule,
                StoreModule.provideStore({
                    UserReducer: UserReducer,
                    NotificationReducer: NotificationReducer,
                    MessageReducer: MessageReducer,
                    BlockerReducer: BlockerReducer
                })
            ],
            providers: [
                { provide: LocationStrategy, useClass: PathLocationStrategy },
                DataService,
                MembershipService,
                NotificationService
            ],
            bootstrap: [
                AppComponent
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], AppModule);
    return AppModule;
}());
//# sourceMappingURL=C:/Frame/Frame/src/FrameUI/src/app/app.module.js.map