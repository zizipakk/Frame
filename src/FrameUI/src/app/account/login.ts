import { Component, AfterViewInit, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Response } from '@angular/http';
import { Store } from '@ngrx/store';
import { Message } from 'primeng/primeng';
import { IappState } from '../models/appState';
import { LoginInputModel } from '../models/user';
import { SignInResult } from '../models/signInResult';
import { MembershipService } from '../services/membershipService';
import { NotificationService } from '../services/notificationService';

@Component({
    selector: 'login-modal',
    templateUrl: 'login.html',
})
export class Login implements AfterViewInit 
{
    /** primeng show/hide prop */
    display: boolean = false;

    user: LoginInputModel;
    message: Message[];

    constructor(
        private router: Router,
        private membershipService: MembershipService,
        private notificationService: NotificationService
    ) {
        this.user = new LoginInputModel({email: '', password: '', rememberLogin: false});
        this.message = new Array<Message>();
    }

    /** ng event */
    ngAfterViewInit() {
        this.display = true;
    }

    /** primeng event */
    onAfterHide(event: any): void {
        this.navigateBack();
    }

    /** custom events */
    onClose() {
        this.display = false;
        this.navigateBack();
    }

    navigateBack() {
        this.router.navigate(['account/register']);
    }

    login() {
        this.membershipService.login(this.user)
            .subscribe(res => {
                this.membershipService.loginCallback(res);
                this.notificationService.printSuccessNotification(new Array<string>('Welcome back ' + this.user.email + '!'));
                this.router.navigate(['/']);
            },
            error => {
                this.membershipService.resetAuthorizationData();
                this.message.push({severity: 'error', summary: 'Error Message', detail: error});
            },
            () => {});
    };

}