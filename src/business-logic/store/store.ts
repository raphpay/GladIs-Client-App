import { Action, ThunkAction, configureStore } from '@reduxjs/toolkit';
import appStateReducer from './slices/appStateReducer';
import formsReducer from './slices/formReducer';
import smqReducer from './slices/smqReducer';
import tokenReducer from './slices/tokenReducer';
import userReducer from './slices/userReducer';
import versionLogAlertReducer from './slices/versionLogAlertReducer';

/**
 * The Redux store instance.
 */
const store = configureStore({
  reducer: {
    appState: appStateReducer,
    forms: formsReducer,
    smq: smqReducer,
    tokens: tokenReducer,
    users: userReducer,
    versionLogAlert: versionLogAlertReducer,
  },
});

export default store;

/**
 * The dispatch function type for the Redux store.
 */
export type AppDispatch = typeof store.dispatch;

/**
 * The root state type for the Redux store.
 */
export type RootState = ReturnType<typeof store.getState>;

/**
 * The type for asynchronous actions in the Redux store.
 */
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
