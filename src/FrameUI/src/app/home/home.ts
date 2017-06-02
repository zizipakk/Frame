import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription, BehaviorSubject } from 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import { API } from '../app.settings';
import { IappState } from '../models/appState';
import { IuserModel } from '../models/userModel';
import { IuserViewModel, UserViewModel } from '../models/UserViewModel';
import { DataService } from '../services/dataService';
import { NotificationService } from '../services/notificationService';
import { SelectItem } from 'primeng/primeng';
import { LocalizationService } from '../services/localizationService';

@Component({
    selector: 'home',
    templateUrl: 'home.html',
})
export class Home {
    
    readonly apiAction = 'user';
    apiPath: string;
    user: IuserModel;
    subscriptions: Subscription[];
    users: IuserViewModel[];
    cols: any;
    names: SelectItem[];
    locks: number;
    locksMin: number;
    locksMax: number;
    localizedText: any;
    localizedTextObserver: Observable<any>;
    localizedTextSubject: BehaviorSubject<any>;

    constructor(
        private store: Store<IappState>,
        private notificationService: NotificationService,
        private dataService: DataService,
        private localize: LocalizationService) {
        this.subscriptions = new Array<Subscription>();
        this.users = new Array<IuserViewModel>();
        this.cols = null;
        this.names = new Array<SelectItem>();
        this.locks = null;
        this.locksMin = null;
        this.locksMax = null;
        this.localizedText = null;
        this.localizedTextSubject = new BehaviorSubject<any>(null);
        this.localizedTextObserver = this.localizedTextSubject.asObservable();
    }

    ngOnInit() {        
        // clear messages & noti
        this.notificationService.clearMessages();        
        this.notificationService.clearNotifications();        

        // init user
        this.subscriptions.push(            
            this.store.select(s => s.UserReducer)
                .subscribe(
                (user) => { 
                    this.user = user; 
                } 
            )
        );
        this.subscriptions.push(
            this.dataService.get<IuserViewModel>(API.AUTH + this.apiAction + '/getusers')
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
        this.subscriptions.push(
            this.localizedTextObserver
                .subscribe(res => {
                    if (res) {                
                        this.localizedText = res;
                        let props = new UserViewModel({
                            accessFailedCount: 0, 
                            email: "", 
                            emailConfirmed: false, 
                            id: "", 
                            isAdmin: false, 
                            language: 0, 
                            lockoutEnabled: false, 
                            lockoutEnd: null, 
                            normalizedEmail: "", 
                            normalizedUserName: "", 
                            phoneNumber: "", 
                            phoneNumberConfirmed: false, 
                            twoFactorEnabled: false, 
                            userName: ""});
                        this.cols = Object.keys(props)
                            .map(name => {
                                return { 
                                    field: name, 
                                    header:  this.localizedText["UserViewModel"][name]}; 
                            }); 
                    }
                })
        );
        this.getLocalizedText();

    }

    getLocalizedText() {
        this.localize.translator.get(["UserViewModel"])
            .subscribe(sub =>
                this.localizedTextSubject.next(sub)
            );
    }

    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }

    isUserLoggedIn(): boolean {
        return this.user.isAuthorized;
    }
}