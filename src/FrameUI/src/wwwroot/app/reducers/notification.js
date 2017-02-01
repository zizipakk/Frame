import { ActionTypes } from './reducer.settings';
export var NotificationReducer = function (state, action) {
    if (state === void 0) { state = []; }
    switch (action.type) {
        case ActionTypes.SET_Notification:
            return action.payload;
        case ActionTypes.RESET_Notification:
            return [];
        case ActionTypes.ADD_Notification:
            return state.concat(action.payload);
        case ActionTypes.REMOVE_Notification:
            return state.filter(function (f) { return action.payload.indexOf(f) !== -1; });
        default:
            return state;
    }
};
//# sourceMappingURL=C:/Frame/Frame/src/FrameUI/src/app/reducers/notification.js.map