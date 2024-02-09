import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import IToken from '../../model/IToken';
import IUser from '../../model/IUser';

export interface TokenState {
  token: IToken | null;
  user: IUser | null;
}

const initialState: TokenState = {
  token: null,
  user: null,
};

export const tokenSlice = createSlice({
  name: 'token',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setToken: (state, action: PayloadAction<IToken>) => {
      // Use the PayloadAction type to declare the contents of `action.payload`
      state.token = action.payload;
    },
    removeToken: (state) => {
      state.token = null;
    },
    // TODO: Separate user and token
    setUser: (state, action: PayloadAction<IUser>) => {
      state.user = action.payload;
    },
    removeUser: (state) => {
      state.user = null;
    }
  },
});

export const { setToken, removeToken, setUser, removeUser } = tokenSlice.actions;

export default tokenSlice.reducer;
