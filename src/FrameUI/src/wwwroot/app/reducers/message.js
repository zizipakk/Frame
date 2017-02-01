import { ActionTypes } from './reducer.settings';
export var MessageReducer = function (state, action) {
    if (state === void 0) { state = []; }
    switch (action.type) {
        case ActionTypes.SET_Message:
            return action.payload;
        case ActionTypes.RESET_Message:
            return [];
        case ActionTypes.ADD_Message:
            return state.concat(action.payload);
        case ActionTypes.REMOVE_Message:
            return state.filter(function (f) { return action.payload.indexOf(f) !== -1; });
        default:
            return state;
    }
};
//# sourceMappingURL=C:/Frame/Frame/src/FrameUI/src/app/reducers/message.js.map