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

    // 2. init seq
    constructor(
        // 2.1. init seq
        private store: Store<IappState>,
        private membershipService: MembershipService,
        private notificationService: NotificationService,
        private router: Router,
        translate: TranslateService) 
    {
        // 2.2. init seq
        this.subscriptions = new Array<Subscription>();

        // this language will be used as a fallback when a translation isn't found in the current language
        translate.setDefaultLang('en');
         // the lang to use, if the lang isn't available, it will use the current loader to get them
        translate.use('en');
    }

    // 3. init seq
    ngOnInit() {        
        // Common app subscriptions
        this.subscriptions.push(
            this.store
                .select(s => s.UserReducer)
                .subscribe((user) => {
                        this.user = user;
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
        let menuItems = 
            [{
                label: 'Home',
                icon: '',
                routerLink: ['/'],
                command: (event) => {},
                items: null
            }];

        if (!this.isUserLoggedIn()) {
            menuItems.push(
                {
                    label: 'Log In',
                    icon: 'fa-unlock-alt fa-fw',
                    routerLink: ['/account/login'],
                    command: (event) => {},
                    items: null
                }
            );
        } else {
            menuItems.push(
                {
                    label: 'Controller Configuration',
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
                        { label: ' Profile', icon: 'fa-fw fa-user', routerLink: null, command: (event) => {} },
                        { label: ' Inbox', icon: 'fa-fw fa-envelope', routerLink: null, command: (event) => {} },
                        { label: ' Settings', icon: 'fa-fw fa-gear', routerLink: null, command: (event) => {} },
                        { label: ' Log Out', icon: 'fa-fw fa-lock', routerLink: null, command: (event) => { this.logOut(); } }
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
