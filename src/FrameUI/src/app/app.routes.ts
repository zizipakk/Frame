import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Home } from './home/home';
import { Account } from './account/account';
import { Login } from './account/login';
import { Register } from './account/register';

const appRoutes: Routes = [
    { path: '', component: Home, canActivate: [AutGuard] }, // default
    {
        path: 'account', component: Account,
        children: [
            {
                path: 'login',
                component: Login
            },
            {
                path: 'register',
                component: Register
            }
        ]        
    },
    { path: '**', redirectTo: '/', pathMatch: 'full' } // if no match url...
];

export const AppRouting: ModuleWithProviders = RouterModule.forRoot(appRoutes);


import { Injectable, OnInit, OnDestroy } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Rx';
import { IappState } from './models/appState';
import { UserModel } from './models/user';
import { MembershipService } from './services/membershipService';

@Injectable()
export class AutGuard implements CanActivate, OnInit, OnDestroy {

    user: UserModel;
    subscription: Subscription;

    constructor(
        private store: Store<IappState>,
        private membershipService: MembershipService,
        private router: Router) {       
            this.user = new UserModel({ // At first we check the persistent data in local storage
            isAuthorized: this.membershipService.retrieve("IsAuthorized"), 
            hasAdminRole: this.membershipService.retrieve("HasAdminRole"), 
            userName: this.membershipService.retrieve("UserName")
        });      
        }
    
    ngOnInit() {
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