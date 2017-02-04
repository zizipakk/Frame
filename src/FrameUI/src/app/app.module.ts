// ng
import { NgModule, ErrorHandler } from '@angular/core';
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
  ToolbarModule,
  GrowlModule,
  BlockUIModule
} from 'primeng/primeng';
import { StoreModule } from '@ngrx/store';
import { 
  UserReducer, 
  NotificationReducer,
  MessageReducer,
  BlockerReducer 
} from './reducers/index';
// custom components
import { AppComponent } from './app.component';
import { Home } from './home/home';
import { Account } from './account/account';
import { Login } from './account/login';
import { Register } from './account/register';
import { AppRouting } from './app.routes';
// custom singleton services
import { DataService } from './services/dataService';
import { MembershipService } from './services/membershipService';
import { NotificationService } from './services/notificationService';
import { AuthGuard } from './app.guard';
import { AppErrorHandler } from './app.error';

@NgModule({
  entryComponents: [ // prebuild
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
    AppRouting, // inherited from ModuleWithProviders, so it is singleton
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

    StoreModule.provideStore({  // singleton the whole store with reducers
      UserReducer,
      NotificationReducer,
      MessageReducer,
      BlockerReducer
     })
  ],
  providers: [ // singletons in whole app
      { provide: LocationStrategy, useClass: PathLocationStrategy }, // override
      { provide: ErrorHandler, useClass: AppErrorHandler },
      DataService,
      MembershipService,
      NotificationService,
      AuthGuard
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
