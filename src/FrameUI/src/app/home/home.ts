import { Component, OnInit } from '@angular/core';
import { MembershipService } from '../services/membershipService';
import { User } from '../models/user';

@Component({
    selector: 'home',
    templateUrl: 'home.html',
})
export class Home implements OnInit {

    constructor(private membershipService: MembershipService) {
    }

    ngOnInit() {
    }

    isUserLoggedIn(): boolean {
        return this.membershipService.IsAuthorized;
    }
}