import { Component, OnInit } from '@angular/core';
import { CORE_DIRECTIVES
    //, FORM_DIRECTIVES
} from '@angular/common'; //TODO: new forms
import { provideForms } from '@angular/forms';
import { Router, ActivatedRoute, ROUTER_DIRECTIVES } from '@angular/router';

import { User } from '../../models/user';
import { OperationResult } from '../../models/operationResult';

import { MembershipService } from '../../services/membershipService';
import { NotificationService } from '../../services/notificationService';

@Component({
    selector: 'login',
    providers: [MembershipService, NotificationService],
    templateUrl: './app/components/account/login.html',
    directives: [CORE_DIRECTIVES,
        //FORM_DIRECTIVES
        provideForms, ROUTER_DIRECTIVES]
})
export class Login implements OnInit {

    private user: User;

    constructor(
        private membershipService: MembershipService,
        private notificationService: NotificationService,
        private route: ActivatedRoute,
        private router: Router
    ) {
        this.user = new User('', '');
    }

    ngOnInit() {
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