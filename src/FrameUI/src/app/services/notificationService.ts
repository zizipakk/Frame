import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Message } from 'primeng/primeng';
import { IappState } from '../models/appState';
import { ActionTypes } from '../reducers/reducer.settings'

/**
 * Local notifi
 */
@Injectable()
export class NotificationService {

    constructor(private store: Store<IappState>) {
    }

    printSuccessMessage(messages: string[]) {
        let payload: Message[] = [];
        messages.forEach(f => payload.push({severity: 'success', summary: 'Success Message', detail: f}));
        this.store.dispatch({ type: ActionTypes.SET_Message, payload: payload});
    }

    printInfoMessage(messages: string[]) {
        let payload: Message[] = [];
        messages.forEach(f => payload.push({severity: 'info', summary: 'Info Message', detail: f}));
        this.store.dispatch({ type: ActionTypes.SET_Message, payload: payload});
    }

    printWarningMessage(messages: string[]) {
        let payload: Message[] = [];
        messages.forEach(f => payload.push({severity: 'warn', summary: 'Warning Message', detail: f}));
        this.store.dispatch({ type: ActionTypes.SET_Message, payload: payload});
    }

    printErrorMessage(messages: string[]) {
        let payload: Message[] = [];
        messages.forEach(f => payload.push({severity: 'error', summary: 'Error Message', detail: f}));
        this.store.dispatch({ type: ActionTypes.SET_Message, payload: payload});
    }

    printSuccessNotification(messages: string[]) {
        let payload: Message[] = [];
        messages.forEach(f => payload.push({severity: 'success', summary: 'Success Message', detail: f}));
        this.store.dispatch({ type: ActionTypes.SET_Notification, payload: payload});
    }

    printInfoNotification(messages: string[]) {
        let payload: Message[] = [];
        messages.forEach(f => payload.push({severity: 'info', summary: 'Info Message', detail: f}));
        this.store.dispatch({ type: ActionTypes.SET_Notification, payload: payload});
    }

    printWarningNotification(messages: string[]) {
        let payload: Message[] = [];
        messages.forEach(f => payload.push({severity: 'warn', summary: 'Warning Message', detail: f}));
        this.store.dispatch({ type: ActionTypes.SET_Notification, payload: payload});
    }

    printErrorNotification(messages: string[]) {
        let payload: Message[] = [];
        messages.forEach(f => payload.push({severity: 'error', summary: 'Error Message', detail: f}));
        this.store.dispatch({ type: ActionTypes.SET_Notification, payload: payload});
    }

    clearMessages() {
        this.store.dispatch({ type: ActionTypes.RESET_Message, payload: null});
    }

    clearNotifications() {
        this.store.dispatch({ type: ActionTypes.RESET_Notification, payload: null});
    }
}