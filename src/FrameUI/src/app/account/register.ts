import { Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router'
import { Iregistration, Registration } from '../models/registration'
import { OperationResult } from '../models/operationResult'
import { MembershipService } from '../services/membershipService';
import { NotificationService } from '../services/notificationService';

@Component({
    selector: 'register-modal',
    templateUrl: 'register.html',
})

export class Register implements AfterViewInit {

    /** primeng show/hide prop */
    display: boolean = false;

    private newUser: Iregistration;

    constructor(
        private membershipService: MembershipService,
        private notificationService: NotificationService,
        private router: Router
    ) {
        this.newUser = new Registration();
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
        this.router.navigate(['/account/login']);
    }

    register(): void {
        var registrationResult: OperationResult = new OperationResult(false, '');
        this.membershipService.register(this.newUser)
            .subscribe(res => {
                // registrationResult.Succeeded = res.Succeeded;
                // registrationResult.Message = res.Message;

            },
            error => console.error('Error: ' + error),
            () => {
                if (registrationResult.Succeeded) {
                    this.notificationService.printSuccessMessage(new Array<string>('Dear ' + this.newUser.email + ', please login with your credentials'));
                    this.router.navigate(['/account/login']);
                }
                else {
                    this.notificationService.printErrorMessage([]);
                }
            });
    };
}