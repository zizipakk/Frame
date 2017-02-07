import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Rx';
import { API } from '../app.settings';
import { IappState } from '../models/appState';
import { UserModel, IuserModel } from '../models/user';
import { UserViewModel, IuserViewModel } from '../models/UserViewModel';
import { DataService } from '../services/dataService';
import { NotificationService } from '../services/notificationService';

@Component({
    selector: 'home',
    templateUrl: 'home.html',
})
export class Home {
    
    readonly apiAction = 'user/getusers';
    apiPath = API.AUTH + this.apiAction;
    user: UserModel;
    subscriptions: Subscription[];
    users: IuserViewModel[];
    cols: any;

    constructor(
        private store: Store<IappState>,
        private notificationService: NotificationService,
        private dataService: DataService) {
        this.subscriptions = new Array<Subscription>();
    }

    ngOnInit() {        
        this.subscriptions.push(            
            this.store.select(s => s.UserReducer)
                .subscribe(
                (user) => { 
                    this.user = user; 
                } 
            )
        );

        this.subscriptions.push(            
            this.dataService.get<IuserViewModel>(
                    this.apiPath
                )
                .subscribe(
                    users => {
                        this.users = users;
                    },
                    error =>
                        this.notificationService.printErrorMessage(new Array<string>(error))
                )
        );

        this.cols = [
            {field: 'id', header: 'Id'},
            {field: 'userName', header: 'Name'},
            {field: 'normalizedUserName', header: 'Normalized Name'},
            {field: 'email', header: 'Email'},
            {field: 'normalizedEmail', header: 'Normalized Email'},
            {field: 'emailConfirmed', header: 'Email Confirmed'},
            {field: 'phoneNumber', header: 'Phone Number'},
            {field: 'phoneNumberConfirmed', header: 'Phone Number Confirmed'},
            {field: 'accessFailedCount', header: 'Failed Count'},
            {field: 'twoFactorEnabled', header: 'TwoFactor Enabled'},
            {field: 'lockoutEnabled', header: 'Lockout Enabled'},
            {field: 'lockoutEnd', header: 'Lockout End'},
            {field: 'isAdmin', header: 'Is Admin'}
        ];
    }

    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }

    isUserLoggedIn(): boolean {
        return this.user.isAuthorized;
    }
}