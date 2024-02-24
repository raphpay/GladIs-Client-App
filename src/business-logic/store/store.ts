import { Action, ThunkAction, configureStore } from '@reduxjs/toolkit';
import appStateReducer from './slices/appStateReducer';
import tokenReducer from './slices/tokenReducer';
import userReducer from './slices/userReducer';

const store = configureStore({
  reducer: {
    appState: appStateReducer,
    tokens: tokenReducer,
    users: userReducer,
  },
});

export default store;

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
