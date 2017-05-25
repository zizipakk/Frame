import { Injectable } from '@angular/core';
import { OnInit, OnDestroy } from '@angular/core';
import { Subscription, Observable } from 'rxjs/Rx';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class ErrorMessages {
    public localizedKeys: Observable<any>;
    
    constructor(private translate: TranslateService) 
    {
    //     this.translate.get(["ValdationErrors"])
    //         .subscribe(res => { 
    //             ErrorMessages.localizedKeys = res;
    //         })
        this.localizedKeys = this.translate.get(["ValdationErrors"]);
    }

} 
