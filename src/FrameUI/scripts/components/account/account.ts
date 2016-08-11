import { Component} from '@angular/core'
import { CORE_DIRECTIVES, FORM_DIRECTIVES } from '@angular/common'
import { ROUTER_DIRECTIVES } from '@angular/router';

@Component({
    selector: 'account',
    templateUrl: './app/components/account/account.html',
    directives: [ROUTER_DIRECTIVES, CORE_DIRECTIVES, FORM_DIRECTIVES]
})

export class Account {
    constructor() {

    }
}