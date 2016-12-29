import { Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { OperationResult } from '../models/operationResult';
import { MembershipService } from '../services/membershipService';
import { NotificationService } from '../services/notificationService';

@Component({
    selector: 'login-modal',
    templateUrl: 'login.html',
})
export class Login implements AfterViewInit {

    /** primeng show/hide prop */
    display: boolean = false;

    user: User;

    constructor(
        private router: Router,
        private membershipService: MembershipService,
        private notificationService: NotificationService,
    ) {
        this.user = new User('', '');
    }

    /** ng event */
    ngAfterViewInit(): void {
        this.display = true;  
    }

    /** primeng event */
    onAfterHide(event): void {
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
        var authenticationResult: OperationResult = new OperationResult(false, '');

        this.membershipService.login(this.user)
            .subscribe(res => {
                authenticationResult.Succeeded = res.Succeeded;
                authenticationResult.Message = res.Message;
            },
            error => { 
                console.error('Error: ' + error);
                this.notificationService.handleError(error, this.membershipService.resetAuthorizationData)
            },
            () => {
                this.membershipService.loginCallback();
                if (authenticationResult.Succeeded) {
                    this.notificationService.printSuccessMessage('Welcome back ' + this.user.Username + '!');
                    this.router.navigateByUrl('/');
                }
                else {
                    this.notificationService.printErrorMessage(authenticationResult.Message);
                }
            });
    };

}