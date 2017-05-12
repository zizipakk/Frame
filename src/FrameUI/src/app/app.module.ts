// ng
import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
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
  BlockUIModule,
  DataTableModule,
  SharedModule,
  DropdownModule,
  SliderModule
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
import { ControllerConfig } from './controller/config';
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
    Register,
    ControllerConfig
  ],
  imports: [
    AppRouting, // inherited from ModuleWithProviders, so it is singleton, and have instance in first steps
    BrowserModule,
    BrowserAnimationsModule,
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
    DataTableModule,
    SharedModule,
    DropdownModule,
    SliderModule,

    StoreModule.provideStore({  // singleton the whole store with reducers
      UserReducer,
      NotificationReducer,
      MessageReducer,
      BlockerReducer
     })
  ],

  // Singletons in whole app.
  // * Instantiate sequence like dependency or first usage (AppGuard)
  providers: [ 
      { provide: LocationStrategy, useClass: PathLocationStrategy }, // ?. Maybe with a common framework

      NotificationService, // 1. : dep in AppErrorHandler
      { provide: ErrorHandler, useClass: AppErrorHandler }, // 2. : dep in framework
      DataService, // 3. : dep in MembershipService
      MembershipService, // 4. : dep in ...
      AuthGuard, // 5. : First usage in MembershipService with routing
  ],
  
  bootstrap: [ // The instantiate follows the singletons
    AppComponent 
  ]
})
export class AppModule { }
