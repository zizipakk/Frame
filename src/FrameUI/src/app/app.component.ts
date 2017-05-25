import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Rx';
import { MenuItem, Message } from 'primeng/primeng';
import { IappState } from './models/appState';
import { ActionTypes } from './reducers/reducer.settings'
import { IuserModel } from './models/userModel';
import { MembershipService } from './services/membershipService';
import { NotificationService } from './services/notificationService';
import { TranslateService } from '@ngx-translate/core';
import { ErrorMessages } from './app.staticResources';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy 
{
    // 1. App init secquent
    menuItems: MenuItem[];
    user: IuserModel;
    notification: Message[];
    message: Message[];
    blocked: boolean;
    subscriptions: Subscription[];
    localizedKeys: any;

    // 2. init seq
    constructor(
        // 2.1. init seq
        private errorMessages: ErrorMessages, //this i sonly for init static resources
        
        private store: Store<IappState>,
        private membershipService: MembershipService,
        private notificationService: NotificationService,
        private router: Router,
        private translate: TranslateService) 
    {
        // 2.2. init seq
        this.subscriptions = new Array<Subscription>();

        // syncron
        // this language will be used as a fallback when a translation isn't found in the current language
        this.translate.setDefaultLang('en');
         // the lang to use, if the lang isn't available, it will use the current loader to get them
        this.translate.use('en');

        this.menuItems = [];
    }

    // 3. init seq
    ngOnInit() {        
        // Common app subscriptions
        this.subscriptions.push(
            this.store
                .select(s => s.UserReducer)
                .subscribe((user) => {
                    this.user = user;
                    if (this.localizedKeys)
                        this.menuItems = this.refreshMenu();
                })
        );        
        this.subscriptions.push(
            this.translate.get(["MainMenu"])
            .subscribe(res => { 
                this.localizedKeys = res;
                this.menuItems = this.refreshMenu();
            })
        );
        this.subscriptions.push(
            this.store
                .select(s => s.NotificationReducer)
                .subscribe((notification) => { 
                    this.notification = notification;
                })
        );
        this.subscriptions.push(
            this.store
                .select(s => s.MessageReducer)
                .subscribe((message) => {
                    this.message = message; 
                })
        );
        this.subscriptions.push(
            this.store.select(s => s.BlockerReducer)
                .subscribe((blocked) => { 
                    this.blocked = blocked; 
                })
        );
    }

    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }

    isUserLoggedIn() {
        return this.user.isAuthorized;
    }

    public refreshMenu(): MenuItem[] {
        let menuItems = [];

        if (!this.isUserLoggedIn()) {
            menuItems.push(
                {
                    label: this.localizedKeys.MainMenu.logIn,
                    icon: 'fa-unlock-alt fa-fw',
                    routerLink: ['/account/login'],
                    command: (event) => {},
                    items: null
                }
            );
        } else {
            menuItems.push(
                {
                    label: this.localizedKeys.MainMenu.controllerConfiguration,
                    icon: 'fa-signal',
                    routerLink: ['/controller/config'],
                    command: (event) => {},
                    items: null
                }
            );
            menuItems.push(
                {
                    label: this.user.userName,
                    icon: 'fa-user',
                    routerLink: null,
                    command: (event) => {},
                    items: [
                        { label: this.localizedKeys.MainMenu.loggedUser.profile, icon: 'fa-fw fa-user', routerLink: null, command: (event) => {} },
                        { label: this.localizedKeys.MainMenu.loggedUser.inbox, icon: 'fa-fw fa-envelope', routerLink: null, command: (event) => {} },
                        { label: this.localizedKeys.MainMenu.loggedUser.settings, icon: 'fa-fw fa-gear', routerLink: null, command: (event) => {} },
                        { label: this.localizedKeys.MainMenu.loggedUser.logOut, icon: 'fa-fw fa-lock', routerLink: null, command: (event) => { this.logOut(); } }
                    ]
                }
            );
        }

        return menuItems;
    }

    logOut() {
        this.membershipService.logout()
            .subscribe(
                () => {
                    this.membershipService.logoutCallback();
                    this.notificationService.printSuccessNotification(new Array<string>('By ' + this.user.userName + '!'));
                },
                error => { 
                    this.membershipService.resetAuthorizationData();
                    this.notificationService.printErrorNotification(error);
                },
                () => this.router.navigate(['account/login'])
            );
    }

}
