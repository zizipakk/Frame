import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MembershipService } from './services/membershipService';
import { User } from './models/user';

import { Home } from './home/home';
import { Account } from './account/account';
import { Login } from './account/login';
import { Register } from './account/register';


import { ViewContainerRef } from '@angular/core';
import { Overlay, OverlayConfig } from 'angular2-modal';
import { Modal } from 'angular2-modal/plugins/bootstrap';
import { LoginModal, LoginModalContext } from './account/login.modal'

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    
    constructor(
        private membershipService: MembershipService,
        private router: Router,
        
        overlay: Overlay, vcRef: ViewContainerRef, public modal: Modal
        ) {
        overlay.defaultViewContainer = vcRef;        
    }

    ngOnInit() {
        this.router.navigate(['/']);
    }

    isUserLoggedIn(): boolean {
        return this.membershipService.isUserAuthenticated();
    }

    getUserName(): string {
        if (this.isUserLoggedIn()) {
            var user: User = this.membershipService.getLoggedInUser();
            return user.Username;
        }
        else
            return 'Account';
    }

    logout(): void {
        this.membershipService.logout()
            .subscribe(res => {
                localStorage.removeItem('user');
            },
            error => console.error('Error: ' + error),
            () => { });
    }

    onClick(): void {
        this.modal.open(LoginModal, new LoginModalContext());
    }
}
