import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Rx';
import { MenuItem, Message } from 'primeng/primeng';
import { IappState } from './models/appState';
import { ActionTypes } from './reducers/reducer.settings'
import { IuserModel } from './models/userModel';
import { LanguageIso } from './models/UserViewModel';
import { MembershipService } from './services/membershipService';
import { NotificationService } from './services/notificationService';
import { LocalizationService } from './services/localizationService';

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
    languages: MenuItem[];

    // 2. init seq
    constructor(
        // 2.1. init seq
        private store: Store<IappState>,
        private membershipService: MembershipService,
        private notificationService: NotificationService,
        private router: Router,
        private localize: LocalizationService) 
    {
        // 2.2. init seq
        this.subscriptions = new Array<Subscription>();
                
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
        this.subscriptions.push(
            this.getLocalizedMenu()
                .subscribe(res => {
                    this.localizedKeys = res;
                    this.menuItems = this.refreshMenu();
                })
        );
        this.subscriptions.push(
            this.getLocalizedLang()
                .subscribe(props => {
                    this.languages = [];
                    for (let key in props)
                        this.languages.push(
                            {
                                label: props[key],
                                icon: null,
                                routerLink: null,
                                command: (event) => this.changeLanguage(key),
                                items: null
                            });
                })
        );
    }
    
    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }

    isUserLoggedIn() {
        return this.user.isAuthorized;
    }

    getLocalizedMenu() {
        return this.localize.translator.get(["MainMenu"])
    }

    getLocalizedLang() {
        return this.localize.translator.get("LanguageIso");
    }

    changeLanguage(lang: string) {
        this.localize.changeLanguage(lang);
        this.getLocalizedLang();
        this.user.language = LanguageIso[lang];
        this.store.dispatch({ type: ActionTypes.SET_User, payload: this.user });
        this.getLocalizedMenu()
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
