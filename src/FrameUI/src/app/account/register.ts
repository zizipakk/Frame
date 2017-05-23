import { Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router'
import { IregisterViewModel, RegisterViewModel } from '../models/RegisterViewModel'
import { OperationResult } from '../models/operationResult'
import { IloginViewModel, LoginViewModel } from '../models/LoginViewModel';
import { MembershipService } from '../services/membershipService';
import { NotificationService } from '../services/notificationService';
import { ClassValidator } from '../validators/classvalidator';
import { Message } from 'primeng/primeng';

@Component({
    selector: 'register-modal',
    templateUrl: 'register.html',
})

export class Register extends ClassValidator implements AfterViewInit {

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
        super();

        this.message = new Array<Message>();
        this.newUser = new RegisterViewModel({
            email: "",
            password: "",
            confirmPassword: "",
            isAdmin: false
        });
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

    async register() {
        await this.validateForm(this.newUser);
        if (this.validationErrors.length === 0) {
            this.message = [];

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
                error => {
                    this.membershipService.resetAuthorizationData();
                    this.message.push({ severity: 'error', summary: 'Error Message', detail: error });
                });
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
    }

}
