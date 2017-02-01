import { ActionReducer, Action } from '@ngrx/store';
import { Message } from 'primeng/primeng';
import { ActionTypes } from './reducer.settings';

export const MessageReducer = (state: Message[] = [], action: Action) => {
    switch (action.type) {
        case ActionTypes.SET_Message:
            return action.payload;
        case ActionTypes.RESET_Message:
            return [];
        case ActionTypes.ADD_Message:
            return state.concat(action.payload);
        case ActionTypes.REMOVE_Message:
            return state.filter(f => action.payload.indexOf(f) !== -1);
        default:
            return state;
    }
}