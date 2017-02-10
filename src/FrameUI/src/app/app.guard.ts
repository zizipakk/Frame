import { Injectable, OnDestroy } from '@angular/core';
import { CanActivate, Router } from '@angular/router';import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Rx';
import { IappState } from './models/appState';
import { IuserModel } from './models/user';
import { MembershipService } from './services/membershipService';

@Injectable()
export class AuthGuard implements CanActivate, OnDestroy {

    user: IuserModel;
    subscription: Subscription;

    constructor(
        private store: Store<IappState>,
        private membershipService: MembershipService,
        private router: Router) {
            this.subscription = this.store.select(s => s.UserReducer).subscribe(
                (user) => { this.user = user; }
            );
        }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    public canActivate() {
        if (this.user.isAuthorized === true) {
            return true;
        }

        this.router.navigate(['account/login']);
        return false;
    }

}