// ng
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule, RequestOptions } from '@angular/http';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
// 3rd party
import { DialogModule } from 'primeng/primeng';
// custom components
import { AppComponent } from './app.component';
import { AppBaseRequestOptions } from './app.settings';
import { Home } from './home/home';
import { Account } from './account/account';
import { Login } from './account/login';
import { Register } from './account/register';
import { appRouting } from './app.routes';
// custom services
import { DataService } from './services/dataService';
import { MembershipService } from './services/membershipService';
import { NotificationService } from './services/notificationService';

@NgModule({
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
    appRouting,
    BrowserModule,
    FormsModule,
    HttpModule,
    DialogModule
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
