import { Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginInputModel } from '../models/user';
import { MembershipService } from '../services/membershipService';
import { NotificationService } from '../services/notificationService';


@Component({
    selector: 'login-modal',
    templateUrl: 'login.html',
})
export class Login implements AfterViewInit {

    /** primeng show/hide prop */
    display: boolean = false;

    user: LoginInputModel;

    constructor(
        private router: Router,
        private membershipService: MembershipService,
        private notificationService: NotificationService,
    ) {
        this.user = new LoginInputModel({email: '', password: '', rememberLogin: false});
    }

    /** ng event */
    ngAfterViewInit(): void {
        this.display = true;  
    }

    /** primeng event */
    onAfterHide(event: any): void {
        this.navigateBack();      
    }
    
    /** custom events */
    onClose(): void {
        this.display = false;  
        this.navigateBack();      
    }

    navigateBack(): void {
        this.router.navigate(['/']);
    }

    login(): void {
        this.membershipService.login(this.user)
            .subscribe(res => {
                this.membershipService.loginCallback(res);
                this.notificationService.printSuccessMessage('Welcome back ' + this.user.email + '!');
                this.router.navigateByUrl('/');
            },
            error => { 
                console.error('Error: ' + error);
                this.notificationService.handleError(error, this.membershipService.resetAuthorizationData)
                this.notificationService.printErrorMessage(error);
            },
            () => {});
    };

}