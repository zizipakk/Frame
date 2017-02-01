import { ActionReducer, Action } from '@ngrx/store';
import { UserModel } from '../models/user';
import { ActionTypes } from './reducer.settings';

export const UserReducer = (state: UserModel = null, action: Action) => {
    switch (action.type) {
        case ActionTypes.SET_User:
            return action.payload;
        case ActionTypes.RESET_User:
            return new UserModel({userName: '', isAuthorized: false, hasAdminRole: false});
        default:
            return state;
    }
}