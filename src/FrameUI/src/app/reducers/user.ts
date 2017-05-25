import { ActionReducer, Action } from '@ngrx/store';
import { IuserModel, UserModel } from '../models/userModel';
import { ActionTypes } from './reducer.settings';

export const UserReducer = (state: IuserModel = new UserModel(), action: Action) => {
    switch (action.type) {
        case ActionTypes.SET_User:
            return action.payload;
        case ActionTypes.RESET_User:            
            return state ? new UserModel() : state;
        default:
            return state;
    }
}