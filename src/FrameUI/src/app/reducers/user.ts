import { ActionReducer, Action } from '@ngrx/store';
import { UserModel } from '../models/user';

export const SET = 'SET';
export const RESET = 'RESET';

export function UserReducer(state: UserModel = null, action: Action) {
    switch (action.type) {
        case SET:
            return action.payload;
        case RESET:
            return new UserModel({userName: '', isAuthorized: false, hasAdminRole: false});
        default:
            return state;
    }
}