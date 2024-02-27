import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import IModule from '../../model/IModule';

export interface AppState {
  module: IModule | undefined
}

const initialState: AppState = {
  module: undefined,
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
  },
});

export const { setModule, removeModule } = appStateSlice.actions;

export default appStateSlice.reducer;
