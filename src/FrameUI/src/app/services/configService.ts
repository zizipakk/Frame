import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { IappState } from '../models/appState';
import { DataService } from './dataService';
import { API } from '../app.settings';

@Injectable()
export class ConfigService {

    constructor(private store: Store<IappState>, private dataService: DataService) {
    }

    loadConfig() {        
        this.dataService.get(API.CONFIG)
            .subscribe(res => {
                if (res) {
                    API.AUTH = res["server.urls"]["authHostPath"];
                    API.APP = res["server.urls"]["apiHostPath"];
                    API.LOG = res["server.urls"]["logHostPath"];
                }
                else
                  throw Error("Init config error!");
            });
    }
}