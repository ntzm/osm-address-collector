import { combineReducers, configureStore } from "@reduxjs/toolkit";
import settingsReducer from "../features/settings/slice";
import customTagsReducer from "../features/customTags/slice";
import addressReducer from "../features/addresses/slice";
import textNoteReducer from "../features/textNotes/slice";

export const store = configureStore({
  reducer: combineReducers({
    settings: settingsReducer,
    customTags: customTagsReducer,
    addresses: addressReducer,
    textNotes: textNoteReducer,
  }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
