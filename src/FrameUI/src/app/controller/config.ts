import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription, BehaviorSubject, Observable } from 'rxjs/Rx';
import { API } from '../app.settings';
import { IappState } from '../models/appState';
import { SelectItem } from 'primeng/primeng';
import { IuserModel } from '../models/userModel';
import { IcomPortTypeView, ComPortTypeView } from '../models/ComPortTypeModels';
import { DataService } from '../services/dataService';
import { NotificationService } from '../services/notificationService';
import { LocalizationService } from '../services/localizationService';

@Component({
    selector: 'config',
    templateUrl: 'config.html',
})
export class ControllerConfig {

    readonly apiAction = 'comconfig';    
    user: IuserModel;
    subscriptions: Subscription[];
    portTypes: IcomPortTypeView[];
    cols: any;
    names: SelectItem[];
    locks: number;
    locksMin: number;
    locksMax: number;
    localizedTextObserver: Observable<any>;
    localizedTextSubject: BehaviorSubject<any>;    

    constructor(
        private store: Store<IappState>,
        private notificationService: NotificationService,
        private dataService: DataService,
        private localize: LocalizationService) {
        this.subscriptions = new Array<Subscription>();
        this.portTypes = new Array<IcomPortTypeView>();
        this.cols = null;
        this.names = new Array<SelectItem>();
        this.localizedTextSubject = new BehaviorSubject<any>(null);
        this.localizedTextObserver = this.localizedTextSubject.asObservable();

    }

    ngOnInit() {        
       this.subscriptions.push(
            this.dataService.get<IcomPortTypeView>(API.APP + this.apiAction + '/getporttypes')
                .subscribe(
                    portTypes => {
                        this.portTypes = portTypes;
                        this.names = [{label: 'All', value: null}] // default filter
                          .concat(
                              [...new Set( // distinct
                                  this.portTypes.map(
                                      m => { return {label: m.portType.toString(), value: m.portType.toString()};}
                                  )
                              )]);
                    },
                    error => this.notificationService.printErrorMessage(new Array<string>(error))                    
                )
        );

        let classProps =  
            new ComPortTypeView({
                addressFormat: "",
                id: "",
                portType: 0,
                readProtocol: "",
                timeStamp: null,
                writeProtocol: ""});
        this.subscriptions.push(
            this.localizedTextObserver
                .subscribe(res => {
                    if (res) {                
                        this.cols = Object.keys(classProps)
                            .map(name => {
                                return { 
                                    field: name, 
                                    header:  res["ComPortTypeView"][name]}; 
                            }); 
                    }
                })
        );
        this.getLocalizedText();
        this.localize.translator.onLangChange
            .subscribe(() => { 
                this.getLocalizedText();
            });

    }

    getLocalizedText() {
        this.localize.translator.get(["ComPortTypeView"])
            .subscribe(sub =>
                this.localizedTextSubject.next(sub)
            );
    }


    //readonly apiActionSetPortType = 'comconfig/setporttype';
    //readonly apiActionGetPortConfigs = 'comconfig/getportconfigs';
    //readonly apiActionSetPortConfig = 'comconfig/setportconfig';
    //readonly apiActionGetDeviceConfigs = 'comconfig/getdeviceconfigs';
    //readonly apiActionSetDeviceConfig = 'comconfig/setdeviceconfig';
    //readonly apiActionGetComLogs = 'comconfig/getcomlogs';



    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }

}