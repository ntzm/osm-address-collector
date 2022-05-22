import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { Settings } from "./types";

const initialState: Settings = {
  throwDistance: 10,
  vibrate: true,
  recordTrace: true,
  darkMode: false,
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    changeThrowDistance(state, action: PayloadAction<number>) {
      state.throwDistance = action.payload;
    },
    toggleVibrate(state) {
      state.vibrate = !state.vibrate;
    },
    toggleRecordTrace(state) {
      state.recordTrace = !state.recordTrace;
    },
    toggleDarkMode(state) {
      state.darkMode = !state.darkMode;
    },
  },
});

export const {
  changeThrowDistance,
  toggleVibrate,
  toggleRecordTrace,
  toggleDarkMode,
} = settingsSlice.actions;

export const selectThrowDistance = (state: RootState) =>
  state.settings.throwDistance;
export const selectVibrate = (state: RootState) => state.settings.vibrate;
export const selectRecordTrace = (state: RootState) =>
  state.settings.recordTrace;
export const selectDarkMode = (state: RootState) => state.settings.darkMode;

export default settingsSlice.reducer;
