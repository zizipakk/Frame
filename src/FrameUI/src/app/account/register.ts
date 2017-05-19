import { Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router'
import { Message } from 'primeng/primeng';
import { IregisterViewModel, RegisterViewModel } from '../models/RegisterViewModel'
import { OperationResult } from '../models/operationResult'
import { IloginViewModel, LoginViewModel } from '../models/LoginViewModel';
import { MembershipService } from '../services/membershipService';
import { NotificationService } from '../services/notificationService';
import { Validator } from "validator.ts/Validator";

@Component({
    selector: 'register-modal',
    templateUrl: 'register.html',
})

export class Register implements AfterViewInit {

    /** primeng show/hide prop */
    display: boolean = false;
    message: Message[];

    newUser: IregisterViewModel;
    user: IloginViewModel;

    constructor(
        private membershipService: MembershipService,
        private notificationService: NotificationService,
        private router: Router
    ) {
        this.newUser = new RegisterViewModel();
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
        //TODO: on submit
        let validator = new Validator();
        let test = validator.validate(this.newUser);
        this.message.concat(test.map(
            m => 
            { 
                return { 
                    severity: "error",
                    summary: m.errorName,
                    detail: m.errorMessage
                };
            }));

        this.user = new LoginViewModel();
        this.user.email = this.newUser.email;
        this.user.password = this.newUser.password;
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