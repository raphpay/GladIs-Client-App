import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import IModule from '../../model/IModule';

export interface AppState {
  module: IModule | undefined,
  pendingUserListCount: number,
  clientListCount: number,
}

const initialState: AppState = {
  module: undefined,
  pendingUserListCount: 0,
  clientListCount: 0,
};

export const appStateSlice = createSlice({
  name: 'appState',
  initialState,
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    setModule: (state, action: PayloadAction<IModule>) => {
      state.module = action.payload;
    },
    removeModule: (state) => {
      state.module = undefined
    },
    setPendingUserListCount: (state, action: PayloadAction<number>) => {
      state.pendingUserListCount = action.payload;
    },
    setClientListCount: (state, action: PayloadAction<number>) => {
      state.clientListCount = action.payload;
    },
  },
});

export const { setModule, removeModule, setPendingUserListCount, setClientListCount } = appStateSlice.actions;

export default appStateSlice.reducer;
