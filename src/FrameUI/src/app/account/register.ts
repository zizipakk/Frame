import { Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router'
import { Message } from 'primeng/primeng';
import { IregisterViewModel, RegisterViewModel } from '../models/RegisterViewModel'
import { OperationResult } from '../models/operationResult'
import { IloginViewModel, LoginViewModel } from '../models/LoginViewModel';
import { MembershipService } from '../services/membershipService';
import { NotificationService } from '../services/notificationService';
import { Validator } from "class-validator";
import { ValidationError } from "class-validator";

@Component({
    selector: 'register-modal',
    templateUrl: 'register.html',
})

export class Register implements AfterViewInit {

    /** primeng show/hide prop */
    display: boolean = false;

    message: Message[];
    validator: Validator;
    validationErrors: ValidationError[];

    newUser: IregisterViewModel;
    user: IloginViewModel;

    constructor(
        private membershipService: MembershipService,
        private notificationService: NotificationService,
        private router: Router
    ) {
        this.newUser = new RegisterViewModel({
            email: "",
            password: "",
            confirmPassword: "",
            isAdmin: false
        });
        this.message = new Array<Message>();
        this.validator = new Validator();
        this.validationErrors = new Array<ValidationError>();
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
        if (this.validateForm(this.newUser)) {
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
        }
    }

    validateForm(obj: any): boolean {        
        this.validator.validate(obj).then(val => { this.validationErrors =  val;});

        if (this.validationErrors.length > 0) {
            let classValidation: Message[] =
                this.validationErrors
                    .map(m => {
                        return { //TODO: localization
                            severity: 'error',
                            summary: m.property,
                            detail: m.constraints.toString()
                        };
                    });
            this.message = [...classValidation];

            return false;
        }

        return true;
    }

    validate(obj: any, property: string): string {
        let errors: ValidationError[] = [];
        this.validator.validate(obj).then(val => errors = val);
        let error = errors.find(f => f.property === property);
        if (error) {
            return error.constraints.toString(); //TODO: localization
        }

        return null;
    }

    //defaultVal(type): any {
    //    if (typeof type !== 'string') throw new TypeError('Type must be a string.');

    //    // Handle simple types (primitives and plain function/object)
    //    switch (type) {
    //        case 'boolean': return false;
    //        case 'function': return function () { };
    //        case 'null': return null;
    //        case 'number': return 0;
    //        case 'object': return {};
    //        case 'string': return "";
    //        case 'symbol': return Symbol();
    //        case 'undefined': return void 0;
    //    }

    //    try {
    //        // Look for constructor in this or current scope
    //        var ctor = typeof this[type] === 'function'
    //            ? this[type]
    //            : eval(type);

    //        return new ctor;

    //        // Constructor not found, return new object
    //    } catch (e) { return {}; }
    //}
}