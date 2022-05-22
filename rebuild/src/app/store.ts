import { combineReducers, configureStore } from "@reduxjs/toolkit";
import settingsReducer from "../features/settings/slice";
import customTagsReducer from "../features/customTags/slice";

export const store = configureStore({
  reducer: combineReducers({
    settings: settingsReducer,
    customTags: customTagsReducer,
  }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
