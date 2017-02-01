import { UserModel } from '../models/user';
import { ActionTypes } from './reducer.settings';
export var UserReducer = function (state, action) {
    if (state === void 0) { state = null; }
    switch (action.type) {
        case ActionTypes.SET_User:
            return action.payload;
        case ActionTypes.RESET_User:
            return new UserModel({ userName: '', isAuthorized: false, hasAdminRole: false });
        default:
            return state;
    }
};
//# sourceMappingURL=C:/Frame/Frame/src/FrameUI/src/app/reducers/user.js.map