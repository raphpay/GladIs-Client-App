import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import IUser from '../../model/IUser';

export interface UserState {
  firstConnection: boolean;
  currentUser: IUser | undefined,
  currentClient: IUser | undefined,
}

const initialState: UserState = {
  firstConnection: true,
  currentUser: undefined,
  currentClient: undefined,
};

export const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    setFirstConnection: (state, action: PayloadAction<boolean>) => {
      state.firstConnection = action.payload;
    },
    setCurrentUser: (state, action: PayloadAction<IUser>) => {
      state.currentUser = action.payload;
    },
    removeCurrentUser: (state) => {
      state.currentUser = undefined
    },
    setCurrentClient: (state, action: PayloadAction<IUser>) => {
      state.currentClient = action.payload;
    },
    removeCurrentClient: (state) => {
      state.currentClient = undefined
    }
  },
});

export const { setFirstConnection, setCurrentUser, removeCurrentUser, setCurrentClient, removeCurrentClient } = userSlice.actions;

export default userSlice.reducer;
