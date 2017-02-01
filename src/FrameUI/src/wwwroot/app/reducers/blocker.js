import { ActionTypes } from './reducer.settings';
export var BlockerReducer = function (state, action) {
    if (state === void 0) { state = false; }
    switch (action.type) {
        case ActionTypes.SET_Blocker:
            return action.payload;
        default:
            return state;
    }
};
//# sourceMappingURL=C:/Frame/Frame/src/FrameUI/src/app/reducers/blocker.js.map