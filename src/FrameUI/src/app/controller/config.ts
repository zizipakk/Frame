import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Rx';
import { API } from '../app.settings';
import { IappState } from '../models/appState';
import { IuserModel } from '../models/userModel';
import { IcomPortTypeView } from '../models/ComPortTypeModels';
import { DataService } from '../services/dataService';
import { NotificationService } from '../services/notificationService';
import { SelectItem } from 'primeng/primeng';

@Component({
    selector: 'config',
    templateUrl: 'config.html',
})
export class ControllerConfig {
    
    readonly apiActionGetPortTypes = 'comconfig/getporttypes';
    readonly apiActionSetPortType = 'comconfig/setporttype';
    readonly apiActionGetPortConfigs = 'comconfig/getportconfigs';
    readonly apiActionSetPortConfig = 'comconfig/setportconfig';
    readonly apiActionGetDeviceConfigs = 'comconfig/getdeviceconfigs';
    readonly apiActionSetDeviceConfig = 'comconfig/setdeviceconfig';
    readonly apiActionGetComLogs = 'comconfig/getcomlogs';
    user: IuserModel;
    subscriptions: Subscription[];
    portTypes: IcomPortTypeView[];
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
        this.portTypes = new Array<IcomPortTypeView>();
        this.cols = null;
        this.names = new Array<SelectItem>();
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
            this.dataService.get<IcomPortTypeView>(
                    API.APP + this.apiActionGetPortTypes
                )
                .subscribe(
                    portTypes => {
                        this.portTypes = portTypes;
                        this.names = [{label: 'All', value: null}] // default filter
                                        .concat(
                                            [...new Set( // distinct
                                                this.portTypes.map(
                                                    m => { return {label: m.portType.toString(), value: m.portType.toString()};}
                                                )
                                            )
                            ]);
                        // TODO: intermediate solution
                        if (this.portTypes)
                            this.cols = Object.getOwnPropertyNames(this.portTypes[0]).map(name => { return { field: name, header: name.charAt(0).toUpperCase() + name.slice(1) }; });          
                    },
                    error => this.notificationService.printErrorMessage(new Array<string>(error))                    
                )
        );

        // TODO: stable with distributed resource cache
        //this.cols = this.resourceService.Getresource<IcomPortTypeView>().map(name => { return { field: name, header: name.charAt(0).toUpperCase() + name.slice(1) }; });     
    }

    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }

    isUserLoggedIn(): boolean {
        return this.user.isAuthorized;
    }
}