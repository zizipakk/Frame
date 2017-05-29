import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ValidationOptions } from "class-validator";
import { IappState } from '../models/appState';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class ConfigService {

    public static localizedKeys: string | any;
    static translateService: TranslateService;

    constructor(private store: Store<IappState>, private translateService: TranslateService) {
        this.translateService = translateService;
        this.load();
    }

    load() {
        // TODO: get http config at first
        if (!this.translateService.getDefaultLang()) {
            let lang = "en";//this.translateService.getBrowserLang();
            this.translateService.setDefaultLang(lang);
            this.translateService.use(lang);
        }        

        this.translateService.get(["ValdationErrors"])
            .subscribe(res => ConfigService.localizedKeys = res);
    }

    public static resolveMessage(key: string, validationOptions?: ValidationOptions): ValidationOptions {
        let localizedMessage = ConfigService.localizedKeys ? ConfigService.localizedKeys[key] : "";
        if (!validationOptions)
            validationOptions = { message: localizedMessage };
        else
            validationOptions.message = localizedMessage;
        return validationOptions;
    }

    public getMessage(key: string, validationOptions?: ValidationOptions): Observable<ValidationOptions> {
        return this.translateService.get(["ValdationErrors." + key])
            .map(m => ({ message: m } as ValidationOptions));
    }
}