import { ActionReducer, Action } from '@ngrx/store';
import { ActionTypes } from './reducer.settings';

export const BlockerReducer = (state: boolean = false, action: Action) => {
    switch (action.type) {
        case ActionTypes.SET_Blocker:
            return action.payload;
        default:
            return state;
    }
}