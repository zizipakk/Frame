import { Component, OnInit } from '@angular/core';
import { MembershipService } from '../services/membershipService';

@Component({
    selector: 'home',
    templateUrl: './app/components/home.html',
    //template: '<h2>EZ MEG home</h2>',
    directives: [],
    providers: [MembershipService]
})
export class Home implements OnInit {

    constructor(private membershipService: MembershipService) {
    }

    ngOnInit() {
    }

    isUserLoggedIn(): boolean {
        return this.membershipService.isUserAuthenticated();
    }
}