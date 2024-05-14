import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import ISurvey from '../../model/ISurvey';

export interface SMQState {
  smqScreenSource: string,
  smqSurveysListCount: number,
  currentSurvey: ISurvey | undefined,
  isUpdatingSurvey: boolean,
}

const initialState: SMQState = {
  smqScreenSource: '',
  smqSurveysListCount: 0,
  currentSurvey: undefined,
  isUpdatingSurvey: false,
};

export const smqSlice = createSlice({
  name: 'smq',
  initialState,
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    setSMQScreenSource: (state, action: PayloadAction<string>) => {
      state.smqScreenSource = action.payload;
    },
    setSMQSurveysListCount: (state, action: PayloadAction<number>) => {
      state.smqSurveysListCount = action.payload;
    },
    setCurrentSurvey: (state, action: PayloadAction<ISurvey>) => {
      state.currentSurvey = action.payload;
    },
    resetCurrentSurvey: (state) => {
      state.currentSurvey = undefined;
    },
    setIsUpdatingSurvey: (state, action: PayloadAction<boolean>) => {
      state.isUpdatingSurvey = action.payload;
    }
  },
});

export const {
  setSMQScreenSource,
  setSMQSurveysListCount,
  setCurrentSurvey, resetCurrentSurvey,
  setIsUpdatingSurvey
} = smqSlice.actions;

export default smqSlice.reducer;
