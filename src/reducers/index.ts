import { combineReducers } from "redux";

const popupApp = combineReducers({
    action: (state, action) => {
        console.log(state, action);
        return {};
    }
});

export default popupApp;