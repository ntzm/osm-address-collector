import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { SurveyStatus } from "./enums";

const initialState = SurveyStatus.NotStarted;

const surveyStatusSlice = createSlice({
  name: "surveyStatus",
  initialState,
  reducers: {
    attemptStart() {
      return SurveyStatus.Starting;
    },
    failedToStart() {
      return SurveyStatus.FailedToStart;
    },
    start() {
      return SurveyStatus.Started;
    },
    pause() {
      return SurveyStatus.Paused;
    },
    finish() {
      return SurveyStatus.Finished;
    },
  },
});

export const { attemptStart, failedToStart, start, pause, finish } =
  surveyStatusSlice.actions;

export const selectSurveyStatus = (state: RootState) => state.surveyStatus;

export default surveyStatusSlice.reducer;
