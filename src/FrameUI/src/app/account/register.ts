import { Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router'
import { Message } from 'primeng/primeng';
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
    message: Message[];

    newUser: Iregistration;
    user: IloginInputModel;

    constructor(
        private membershipService: MembershipService,
        private notificationService: NotificationService,
        private router: Router
    ) {
        this.newUser = new Registration();
        this.message = new Array<Message>();
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
        this.user = new LoginInputModel(this.newUser as IloginInputModel);     
        this.membershipService.register(this.newUser)
            .mergeMap(() => this.membershipService.login(this.user)) //this is the way for chained http observables usage
            .subscribe(res => {
                this.notificationService.printSuccessNotification(new Array<string>('Dear ' + this.newUser.email + ', your gracefull registered and logged in!'));    
                this.membershipService.loginCallback(res);
                this.router.navigate(['/']);                       
            },
            error => 
            {   
                this.membershipService.resetAuthorizationData();
                this.message.push({severity: 'error', summary: 'Error Message', detail: error});
            });
    }
}