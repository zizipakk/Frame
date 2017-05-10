import { Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router'
import { Iregistration, Registration } from '../models/registration'
import { OperationResult } from '../models/operationResult'
import { IloginInputModel, LoginInputModel } from '../models/user';
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
    private user: IloginInputModel;

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
        this.membershipService.register(this.newUser)
            .subscribe(res => {
                this.membershipService.loginCallback(res);
                this.notificationService.printSuccessNotification(new Array<string>('Dear ' + this.newUser.email + ', your gracefull registered, and logged in!'));
                this.router.navigate(['/']);
            },
            error => console.error('Error: ' + error));
    };
}