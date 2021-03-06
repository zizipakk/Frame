﻿import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription, BehaviorSubject } from 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import { MenuItem, Message, SelectItem } from 'primeng/primeng';
import { IappState } from './models/appState';
import { ActionTypes } from './reducers/reducer.settings'
import { IuserModel, UserModel } from './models/userModel';
import { LanguageIso } from './models/UserViewModel';
import { MembershipService } from './services/membershipService';
import { NotificationService } from './services/notificationService';
import { LocalizationService } from './services/localizationService';
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
    languages: SelectItem[];
    selectedLanguage: string;
    user: IuserModel;
    notification: Message[];
    message: Message[];
    blocked: boolean;
    subscriptions: Subscription[];
    localizedKeys: any;    
    localizedMenu: Observable<any>;
    localizedMenuSubject: BehaviorSubject<any>;

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
        this.localizedMenuSubject = new BehaviorSubject<any>(null);
        this.localizedMenu = this.localizedMenuSubject.asObservable();
        this.user = new UserModel();        
        this.menuItems = [];
        this.languages = [];
    }

    // 3. init seq
    ngOnInit() {        
        // Common app subscriptions
        this.subscriptions.push(
            this.store
                .select(s => s.UserReducer)
                .subscribe((user) => {
                    if ((user && user.userName) || (this.user.userName)) {
                        this.user = user;
                        if (this.menuItems.length > 0 && this.languages.length > 0) {
                            this.menuItems = this.createLeftMenu(this.localizedKeys.MainMenu);
                            this.languages = this.createRightMenu(this.localizedKeys.LanguageIso);                         
                        }
                    }
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

        // TDOD: only one loci for both
        this.subscriptions.push(
            this.localizedMenu
                .subscribe(res => {
                    if (res) {                
                        this.localizedKeys = res;
                        this.menuItems = this.createLeftMenu(res.MainMenu);
                        this.languages = this.createRightMenu(res.LanguageIso);                         
                    }
                })
        );
        this.getLocalizedMenu();
        this.localize.translator.onLangChange
            .subscribe(() => { 
                this.getLocalizedMenu();
            });
    }
    
    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }

    isUserLoggedIn() {
        return this.user.isAuthorized;
    }

    getLocalizedMenu() {
        this.localize.translator.get(["MainMenu", "LanguageIso"])
            .subscribe(sub =>
                this.localizedMenuSubject.next(sub)
            );
    }

    changeLanguage() {
        this.localize.changeLanguage(this.selectedLanguage);
        this.user.language = LanguageIso[this.selectedLanguage];
        this.store.dispatch({ type: ActionTypes.SET_User, payload: this.user });        
    }y

    createRightMenu(props: any): SelectItem[] {
        let languages = [];

        for (let key in props)
            languages.push(
                {
                    label: props[key],
                    value: key
                });

        return languages;
    }

    createLeftMenu(props: any): MenuItem[] {
        let menuItems = [];

        if (props) {
            if (!this.isUserLoggedIn()) {
                menuItems.push(
                    {
                        label: props.logIn,
                        icon: 'fa-unlock-alt fa-fw',
                        routerLink: ['/account/login'],
                        command: (event) => {},
                        items: null
                    }
                );
            } else {
                menuItems.push(
                    {
                        label: props.controllerConfiguration,
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
                            { label: props.loggedUser.profile, icon: 'fa-fw fa-user', routerLink: null, command: (event) => {} },
                            { label: props.loggedUser.inbox, icon: 'fa-fw fa-envelope', routerLink: null, command: (event) => {} },
                            { label: props.loggedUser.settings, icon: 'fa-fw fa-gear', routerLink: null, command: (event) => {} },
                            { label: props.loggedUser.logOut, icon: 'fa-fw fa-lock', routerLink: null, command: (event) => { this.logOut(); } }
                        ]
                    }
                );
            }
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
