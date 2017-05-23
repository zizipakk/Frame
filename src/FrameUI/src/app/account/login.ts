﻿import { Component, AfterViewInit, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Response } from '@angular/http';
import { Store } from '@ngrx/store';
import { Message } from 'primeng/primeng';
import { IappState } from '../models/appState';
import { IloginViewModel, LoginViewModel } from '../models/LoginViewModel';
import { SignInResult } from '../models/signInResult';
import { MembershipService } from '../services/membershipService';
import { NotificationService } from '../services/notificationService';
import { ClassValidator } from '../validators/classvalidator';

@Component({
    selector: 'login-modal',
    templateUrl: 'login.html',
})
export class Login extends ClassValidator implements AfterViewInit 
{
    /** primeng show/hide prop */
    display: boolean = false;
    message: Message[];

    user: IloginViewModel;

    constructor(
        private router: Router,
        private membershipService: MembershipService,
        private notificationService: NotificationService
    ) {
        super();

        this.user = new LoginViewModel({
            email: "", 
            password: "", 
            rememberMe: null, 
            enableLocalLogin: false, 
            externalProviders: null, 
            returnUrl: ""});
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

    async login() {
        await this.validateForm(this.user);
        if (this.validationErrors.length === 0) {
            this.message = [];

            this.membershipService.login(this.user)
                .subscribe(res => {
                        this.membershipService.loginCallback(res);
                        this.notificationService.printSuccessNotification(new Array<string>('Welcome back ' + this.user.email + '!'));
                        this.router.navigate(['/']);
                    },
                    error => {
                        this.membershipService.resetAuthorizationData();
                        this.message.push({severity: 'error', summary: 'Error Message', detail: error}); // Only on dialog
                    },
                    () => {}
                );
        } else {
            let classValidation: Message[] =
                this.validationErrors
                    .map(m => {
                        return { //TODO: localization
                            severity: 'error',
                            summary: m.property,
                            detail: JSON.stringify(m.constraints)
                        };
                    });
            this.message = [...classValidation];
        }
    };

}