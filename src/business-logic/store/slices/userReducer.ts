import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserState {
  firstConnection: boolean;
}

const initialState: UserState = {
  firstConnection: true,
};

export const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    setFirstConnection: (state, action: PayloadAction<boolean>) => {
      state.firstConnection = action.payload;
    },
  },
});

export const { setFirstConnection } = userSlice.actions;

export default userSlice.reducer;
