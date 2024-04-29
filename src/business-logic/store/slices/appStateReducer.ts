import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import IModule from '../../model/IModule';
import ISurvey from '../../model/ISurvey';

export interface AppState {
  module: IModule | undefined,
  pendingUserListCount: number,
  clientListCount: number,
  documentListCount: number,
  passwordResetTokenCount: number,
  smqScreenSource: string,
  smqSurveysListCount: number,
  currentSurvey: ISurvey | undefined,
}

const initialState: AppState = {
  module: undefined,
  pendingUserListCount: 0,
  clientListCount: 0,
  documentListCount: 0,
  passwordResetTokenCount: 0,
  smqScreenSource: '',
  smqSurveysListCount: 0,
  currentSurvey: undefined,
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
    setDocumentListCount: (state, action: PayloadAction<number>) => {
      state.documentListCount = action.payload;
    },
    setPasswordResetTokenCount: (state, action: PayloadAction<number>) => {
      state.passwordResetTokenCount = action.payload;
    },
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
    }
  },
});

export const {
  setModule,
  removeModule,
  setPendingUserListCount,
  setClientListCount,
  setDocumentListCount,
  setPasswordResetTokenCount,
  setSMQScreenSource,
  setSMQSurveysListCount,
  setCurrentSurvey, resetCurrentSurvey
} = appStateSlice.actions;

export default appStateSlice.reducer;
