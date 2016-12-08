import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DialogRef, ModalComponent, CloseGuard } from 'angular2-modal';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap/index';

import { User } from '../models/user';
import { OperationResult } from '../models/operationResult';

import { MembershipService } from '../services/membershipService';
import { NotificationService } from '../services/notificationService';

export class LoginModalContext extends BSModalContext {
    constructor() {
        super();
    }
}

@Component({
    templateUrl: 'login.modal.html'
})

export class LoginModal implements CloseGuard, ModalComponent<LoginModalContext> {

    private context: LoginModalContext;

    private user: User;

    constructor(
        public dialog: DialogRef<LoginModalContext>,

        private router: Router,
        private membershipService: MembershipService,
        private notificationService: NotificationService,
    ) {
        this.context = dialog.context;
        this.user = new User('', '');
    }

    onClose(): void {
        this.dialog.close();
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
    }

    onRegister(): void {
        //this.modal.open(LoginModal, new LoginModalContext());
        console.error("regiszter");
    }

}