import { Component, OnInit, AfterViewInit, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Modal } from 'angular2-modal/plugins/bootstrap';
import { Overlay } from 'angular2-modal';

import { User } from '../models/user';
import { OperationResult } from '../models/operationResult';

import { MembershipService } from '../services/membershipService';
import { NotificationService } from '../services/notificationService';

@Component({
    selector: 'login',
    // templateUrl: 'login.html',
    template: '<div></div>',
    providers: [ Modal, Overlay ]
})
export class Login implements OnInit, AfterViewInit {

    private user: User;

    constructor(
        public modal: Modal,
        private overlay: Overlay,
        private vcRef: ViewContainerRef,

        private router: Router,
        private membershipService: MembershipService,
        private notificationService: NotificationService,
    ) {
        overlay.defaultViewContainer = vcRef;

        this.user = new User('', '');
    }

    ngOnInit() {
    }

    ngAfterViewInit(): void {
        this.modal.alert()
        .size('lg')
        .showClose(true)
        .title('TEST')
        .body('login.html')
        .open();        

    }

    login(): void {
        var authenticationResult: OperationResult = new OperationResult(false, '');

        this.membershipService.login(this.user)
            .subscribe(res => {
                authenticationResult.Succeeded = res.Succeeded;
                authenticationResult.Message = res.Message;
            },
            error => console.error('Error: ' + error),
            () => {
                if (authenticationResult.Succeeded) {
                    this.notificationService.printSuccessMessage('Welcome back ' + this.user.Username + '!');
                    localStorage.setItem('user', JSON.stringify(this.user));
                    this.router.navigateByUrl('/');
                }
                else {
                    this.notificationService.printErrorMessage(authenticationResult.Message);
                }
            });
    };
}