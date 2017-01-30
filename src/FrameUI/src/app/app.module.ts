// ng
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
// 3rd party
import { 
  DialogModule,
  ButtonModule,
  CheckboxModule,
  InputTextModule,
  PasswordModule,
  MessagesModule,
  MenuModule,
  MenubarModule,
  ToolbarModule
 } from 'primeng/primeng';
import { StoreModule } from '@ngrx/store';
import { UserReducer } from './reducers/index';
// custom components
import { AppComponent } from './app.component';
import { Home } from './home/home';
import { Account } from './account/account';
import { Login } from './account/login';
import { Register } from './account/register';
import { AppRouting } from './app.routes';
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
    StoreModule.provideStore({ user: UserReducer }),
    ToolbarModule
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
})
export class AppModule { }
