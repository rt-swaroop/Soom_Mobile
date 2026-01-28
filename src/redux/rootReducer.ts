import { combineReducers } from '@reduxjs/toolkit';

import authReducer from './reducers/authReducer'
import settingsReducer from './reducers/settingsReducer'
import notificationReducer from './reducers/notificationReducer'

const rootReducer = combineReducers({
    auth: authReducer,
    settings: settingsReducer,
    notifications: notificationReducer,
});
export default rootReducer;