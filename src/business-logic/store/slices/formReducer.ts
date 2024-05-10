import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface FormState {
  formsCount: number,
}

const initialState: FormState = {
  formsCount: 0,
};

export const formsSlice = createSlice({
  name: 'forms',
  initialState,
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    setFormsCount: (state, action: PayloadAction<number>) => {
      state.formsCount = action.payload;
    }
  },
});

export const {
  setFormsCount,
} = formsSlice.actions;

export default formsSlice.reducer;
