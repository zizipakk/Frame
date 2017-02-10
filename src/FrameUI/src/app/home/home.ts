import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Rx';
import { API } from '../app.settings';
import { IappState } from '../models/appState';
import { IuserModel } from '../models/user';
import { IuserViewModel } from '../models/UserViewModel';
import { DataService } from '../services/dataService';
import { NotificationService } from '../services/notificationService';
import { SelectItem } from 'primeng/primeng';

@Component({
    selector: 'home',
    templateUrl: 'home.html',
})
export class Home {
    
    readonly apiAction = 'user/getusers';
    apiPath = API.AUTH + this.apiAction;
    user: IuserModel;
    subscriptions: Subscription[];
    users: IuserViewModel[];
    cols: any;
    names: SelectItem[];
    locks: number;
    locksMin: number;
    locksMax: number;

    constructor(
        private store: Store<IappState>,
        private notificationService: NotificationService,
        private dataService: DataService) {
        this.subscriptions = new Array<Subscription>();
        this.users = new Array<IuserViewModel>();
        this.cols = null;
        this.names = new Array<SelectItem>();
        this.locks = null;
        this.locksMin = null;
        this.locksMax = null;
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

            // TODO: LAZYLOADING            
            this.dataService.get<IuserViewModel>(
                    this.apiPath
                )
                .subscribe(
                    users => {
                        this.users = users;
                        this.names = [{label: 'All', value: null}] // default filter
                                        .concat(
                                            [...new Set( // distinct
                                                this.users.map(
                                                    m => { return {label: m.userName, value: m.userName};}
                                                )
                                            )
                                        ]);
                        this.locks = this.locksMin = Math.min.apply(Math, this.users.map(m => m.accessFailedCount));
                        this.locksMax = Math.max.apply(Math, this.users.map(m => m.accessFailedCount));
                    },
                    error =>
                        this.notificationService.printErrorMessage(new Array<string>(error))
                )
        );

        // TODO: it clould be better from response model with localization
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