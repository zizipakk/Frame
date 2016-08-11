import { provide, Component, OnInit } from '@angular/core';
import { CORE_DIRECTIVES, APP_BASE_HREF } from '@angular/common';
import { Observable } from 'rxjs/Rx'; //http://stackoverflow.com/questions/37030963/angular-2-2-0-0-rc-1-property-map-does-not-exist-on-type-observableresponse
import 'rxjs/add/operator/map'; //
import { Router, ActivatedRoute, ROUTER_DIRECTIVES } from '@angular/router';
import { MembershipService } from './services/membershipService';
import { User } from './models/user';
import { Home } from './components/home';                   //for routing precomp
import { Account } from './components/account/account';     //
import { Login } from './components/account/login';         //
import { Register } from './components/account/register';   //

@Component({
    selector: 'frame-app',
    templateUrl: './app/app.html',
    directives: [        
        ROUTER_DIRECTIVES,
        CORE_DIRECTIVES
    ],
    providers: [
        MembershipService,
    ],
    precompile: [ Home, Account, Login, Register ]
})

export class AppComponent implements OnInit {

    constructor(
        private membershipService: MembershipService,
        private router: Router) {        
    }

    ngOnInit() {
        this.router.navigate(['/']);
    }

    isUserLoggedIn(): boolean {
        return this.membershipService.isUserAuthenticated();
    }

    getUserName(): string {
        if (this.isUserLoggedIn()) {
            var user: User = this.membershipService.getLoggedInUser();
            return user.Username;
        }
        else
            return 'Account';
    }

    logout(): void {
        this.membershipService.logout()
            .subscribe(res => {
                localStorage.removeItem('user');
            },
            error => console.error('Error: ' + error),
            () => { });
    }
}