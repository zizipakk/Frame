import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Rx';
import { MenuItem } from 'primeng/primeng';
import { IappState } from './models/appState';
import { UserModel } from './models/user';
import { MembershipService } from './services/membershipService';
import { NotificationService } from './services/notificationService';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy 
{
    
    menuItems: MenuItem[];
    user: UserModel;
    subscriptions: Subscription[];

    constructor(
        private store: Store<IappState>,
        private membershipService: MembershipService,
        private notificationService: NotificationService,
        private router: Router) 
    {
        this.user = new UserModel({
            isAuthorized: this.membershipService.retrieve("IsAuthorized"), 
            hasAdminRole: this.membershipService.retrieve("HasAdminRole"), 
            userName: this.membershipService.retrieve("UserName")
        });
        this.subscriptions = new Array<Subscription>();
    }

    ngOnInit() {
        // Init all environment        
        this.store.dispatch({ type: 'SET', payload: this.user });
        
        this.subscriptions.push(            
            this.store.select(s => s.user).subscribe(
                (user) => {
                        this.user = user;
                        this.menuItems = this.refreshMenu();                     
                } 
            )
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
            .subscribe(() => {
                this.membershipService.logoutCallback();
                this.notificationService.printSuccessMessage('By ' + this.user.userName + '!');
            },
            error => { 
                console.error('Error: ' + error);
                this.notificationService.handleError(error, this.membershipService.resetAuthorizationData)
                this.notificationService.printErrorMessage(error);
            },
            () => { this.refreshMenu(); });        
    }

}
