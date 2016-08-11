import { Component, OnInit} from '@angular/core';
import { CORE_DIRECTIVES, FORM_DIRECTIVES } from '@angular/common';
import {
    //RouterConfig,
    Router,
    //ActivatedRoute,
    ROUTER_DIRECTIVES } from '@angular/router'

import { Registration } from '../../models/registration'

import { ROUTES } from '../../routes'
import { OperationResult } from '../../models/operationResult'
import { MembershipService } from '../../services/membershipService';
import { NotificationService } from '../../services/notificationService';

@Component({
    selector: 'register',
    templateUrl: './app/components/account/register.html',
    directives: [CORE_DIRECTIVES, FORM_DIRECTIVES, ROUTER_DIRECTIVES],
    providers: [MembershipService, NotificationService]
})

export class Register implements OnInit {

    private newUser: Registration;

    constructor(
        private membershipService: MembershipService,
        private notificationService: NotificationService,
        //private route: ActivatedRoute,
        private router: Router
        //private routerConfig: RouterConfig
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
                    //?
                    this.router.navigate([ROUTES.map(m => m.path == 'login')]);
                }
                else {
                    this.notificationService.printErrorMessage(registrationResult.Message);
                }
            });
    };
}