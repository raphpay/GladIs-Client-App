import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface VersionLogAlertState {
  show: boolean | null;
}

const initialState: VersionLogAlertState = {
  show: null,
};

export const versionLogAlertSlice = createSlice({
  name: 'versionLogAlert',
  initialState,
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    toggleVersionLogAlertDisplay: (state, action: PayloadAction<boolean>) => {
      state.show = action.payload;
    },
  },
});

export const { toggleVersionLogAlertDisplay } = versionLogAlertSlice.actions;

export default versionLogAlertSlice.reducer;
