import { Component, Input, OnInit } from '@angular/core';
import { MembershipService } from '../services/membershipService';
import { AppComponent } from '../index';

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