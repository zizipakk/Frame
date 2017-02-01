import { ActionReducer, Action } from '@ngrx/store';
import { Message } from 'primeng/primeng';
import { ActionTypes } from './reducer.settings';

export const NotificationReducer = (state: Message[] = [], action: Action) => {
    switch (action.type) {
        case ActionTypes.SET_Notification:
            return action.payload;
        case ActionTypes.RESET_Notification:
            return [];
        case ActionTypes.ADD_Notification:
            return state.concat(action.payload);
        case ActionTypes.REMOVE_Notification:
            return state.filter(f => action.payload.indexOf(f) !== -1);
        default:
            return state;
    }
}