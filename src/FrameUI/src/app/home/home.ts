import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Rx';
import { IappState } from '../models/appState';
import { UserModel } from '../models/user';

@Component({
    selector: 'home',
    templateUrl: 'home.html',
})
export class Home {
    
    user: UserModel;
    subscriptions: Subscription[];

    constructor(private store: Store<IappState>) {
        this.subscriptions = new Array<Subscription>();
    }

    ngOnInit() {        
        this.subscriptions.push(            
            this.store.select(s => s.user).subscribe(
                (user) => { this.user = user; } 
            )
        );
    }

    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }

    isUserLoggedIn(): boolean {
        return this.user.isAuthorized;
    }
}