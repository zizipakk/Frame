import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule, RequestOptions } from '@angular/http';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';

import { ModalModule } from 'angular2-modal';
import { BootstrapModalModule } from 'angular2-modal/plugins/bootstrap';

import { AppBaseRequestOptions } from './app.settings';
import { AppComponent } from './app.component';
import { Home } from './home/home';
import { Account } from './account/account';

import { Login } from './account/login';
import { LoginModal } from './account/login.modal'

import { Register } from './account/register';
import { appRouting } from './app.routes';

import { DataService } from './services/dataService';
import { MembershipService } from './services/membershipService';
import { NotificationService } from './services/notificationService';

@NgModule({
  entryComponents: [
    LoginModal
  ],
  declarations: [
    AppComponent,
    Home, 
    Account,

    Login, 
    LoginModal,

    Register    
  ],
  imports: [
    appRouting,
    BrowserModule,
    FormsModule,
    HttpModule,

    ModalModule.forRoot(),
    BootstrapModalModule

  ],
  providers: [
      { provide: RequestOptions, useClass: AppBaseRequestOptions },
      { provide: LocationStrategy, useClass: PathLocationStrategy },
      DataService,
      MembershipService,
      NotificationService
  ],  
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
