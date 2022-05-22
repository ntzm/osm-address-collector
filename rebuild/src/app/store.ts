import { combineReducers, configureStore } from "@reduxjs/toolkit";
import settingsReducer from "../features/settings/slice";

export const store = configureStore({
  reducer: combineReducers({
    settings: settingsReducer,
  }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
