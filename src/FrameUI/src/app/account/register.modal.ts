import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router'
import { appRoutes } from '../app.routes'

import { Registration } from '../models/registration'
import { OperationResult } from '../models/operationResult'
import { MembershipService } from '../services/membershipService';
import { NotificationService } from '../services/notificationService';

@Component({
    selector: 'register',
    templateUrl: 'register.html',
    // providers: [ 
    //     MembershipService, 
    //     NotificationService 
    // ]
})

export class Register implements OnInit {

    private newUser: Registration;

    constructor(
        private membershipService: MembershipService,
        private notificationService: NotificationService,
        private router: Router
    ) {
        this.newUser = new Registration('', '', '');
    }

    ngOnInit() {
    }

    register(): void {
        var registrationResult: OperationResult = new OperationResult(false, '');
        this.membershipService.register(this.newUser)
            .subscribe(res => {
                registrationResult.Succeeded = res.Succeeded;
                registrationResult.Message = res.Message;

            },
            error => console.error('Error: ' + error),
            () => {
                if (registrationResult.Succeeded) {
                    this.notificationService.printSuccessMessage('Dear ' + this.newUser.Username + ', please login with your credentials');
                    this.router.navigate([appRoutes.map(m => m.path == 'login')]);
                }
                else {
                    this.notificationService.printErrorMessage(registrationResult.Message);
                }
            });
    };
}