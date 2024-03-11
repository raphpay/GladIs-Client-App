import { Action, ThunkAction, configureStore } from '@reduxjs/toolkit';
import appStateReducer from './slices/appStateReducer';
import tokenReducer from './slices/tokenReducer';
import userReducer from './slices/userReducer';

/**
 * The Redux store instance.
 */
const store = configureStore({
  reducer: {
    appState: appStateReducer,
    tokens: tokenReducer,
    users: userReducer,
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
