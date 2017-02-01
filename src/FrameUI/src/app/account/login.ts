import { Component, AfterViewInit, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Response } from '@angular/http';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Rx';
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
    subscriptions: Subscription[];    

    constructor(
        private store: Store<IappState>,
        private router: Router,
        private membershipService: MembershipService,
        private notificationService: NotificationService
    ) {
        this.user = new LoginInputModel({email: '', password: '', rememberLogin: false});
        this.subscriptions = new Array<Subscription>();
        this.subscriptions.push(            
            this.store.select(s => s.MessageReducer).subscribe(
                (message) => {
                        this.message = message;
                } 
            )
        );
    }
    
    /** ng event */
    ngAfterViewInit() {
        this.display = true;  
    }

    // /** primeng event */
    // onAfterHide(event: any) {        
    //     this.navigateBack();      
    // }
    
    /** custom events */
    onClose() {
        this.display = false;  
        this.navigateBack();      
    }

    navigateBack() {
        this.router.navigate(['/']);
    }

    login() {
        this.membershipService.login(this.user)
            //.map(res => <SignInResult>(<any>res))
            .subscribe(res => {
                this.membershipService.loginCallback(res);
                this.notificationService.printSuccessNotification(new Array<string>('Welcome back ' + this.user.email + '!'));
                this.navigateBack();
            },
            error => {
                this.membershipService.resetAuthorizationData();
                this.notificationService.printErrorMessage(error);
            },
            () => {});
    };

}