import { Action, ThunkAction, configureStore } from '@reduxjs/toolkit';
import tokenReducer from './slices/tokenReducer';
import userReducer from './slices/userReducer';

const store = configureStore({
  reducer: {
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
