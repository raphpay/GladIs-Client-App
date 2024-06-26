import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import IUser from '../../model/IUser';

export interface UserState {
  currentUser: IUser | undefined,
  currentClient: IUser | undefined,
  isAdmin: boolean,
}

const initialState: UserState = {
  currentUser: undefined,
  currentClient: undefined,
  isAdmin: false,
};

export const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    setCurrentUser: (state, action: PayloadAction<IUser>) => {
      state.currentUser = action.payload;
    },
    removeCurrentUser: (state) => {
      state.currentUser = undefined
    },
    setIsAdmin: (state, action: PayloadAction<boolean>) => {
      state.isAdmin = action.payload;
    },
    setCurrentClient: (state, action: PayloadAction<IUser>) => {
      state.currentClient = action.payload;
    },
    removeCurrentClient: (state) => {
      state.currentClient = undefined
    },
    changeClientBlockedStatus: (state, action: PayloadAction<boolean>) => {
      if (state.currentClient) {
        state.currentClient.isBlocked = action.payload;
      }
    }
  },
});

export const {
  setCurrentUser, removeCurrentUser, setIsAdmin,
  setCurrentClient, removeCurrentClient,
  changeClientBlockedStatus,
} = userSlice.actions;

export default userSlice.reducer;
