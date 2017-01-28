import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/primeng';
import { MembershipService } from './services/membershipService';
import { NotificationService } from './services/notificationService';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit  {
    
    menuItems: MenuItem[];
    userName: string;

    constructor(
        private membershipService: MembershipService,
        private notificationService: NotificationService,
        private router: Router) 
    {
        this.userName = this.isUserLoggedIn() ? this.membershipService.UserName : '';
    }

    ngOnInit() {
        this.menuItems = 
            [{
                label: 'Home',
                icon: '',
                routerLink: ['/'],
                command: (event) => {},
                items: null
            }];

        if (!this.isUserLoggedIn()) {
            this.menuItems.push(
                {
                    label: 'Log In',
                    icon: 'fa-unlock-alt fa-fw',
                    routerLink: ['/account/login'],
                    command: (event) => {},
                    items: null
                }
            );
        } else {
            this.menuItems.push(
                {
                    label: this.userName,
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

        this.navigateBack();
    }

    navigateBack(): void {
        this.router.navigate(['/']);
    }

    isUserLoggedIn(): boolean {
        return this.membershipService.IsAuthorized;
    }

    logOut(): void {
        this.membershipService.logout()
            .subscribe(res => {
                this.membershipService.logoutCallback(res);
                this.notificationService.printSuccessMessage('By ' + this.userName + '!');
            },
            error => { 
                console.error('Error: ' + error);
                this.notificationService.handleError(error, this.membershipService.resetAuthorizationData)
                this.notificationService.printErrorMessage(error);
            },
            () => { this.navigateBack(); });        
    }

}
