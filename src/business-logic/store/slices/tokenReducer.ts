import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import IToken from '../../model/IToken';

export interface TokenState {
  token: IToken | null;
}

const initialState: TokenState = {
  token: null,
};

export const tokenSlice = createSlice({
  name: 'tokens',
  initialState,
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    setToken: (state, action: PayloadAction<IToken>) => {
      state.token = action.payload;
    },
    removeToken: (state) => {
      state.token = null;
    },
  },
});

export const { setToken, removeToken } = tokenSlice.actions;

export default tokenSlice.reducer;
