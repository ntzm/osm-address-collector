import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { CustomTag } from "./types";

const initialState: CustomTag[] = [];

const customTagsSlice = createSlice({
  name: "customTags",
  initialState,
  reducers: {
    addTag(state, action: PayloadAction<CustomTag>) {
      state.push(action.payload);
    },
    changeTagKey(state, action: PayloadAction<{ id: number; newKey: string }>) {
      state[action.payload.id].key = action.payload.newKey;
    },
    changeTagValue(
      state,
      action: PayloadAction<{ id: number; newValue: string }>
    ) {
      state[action.payload.id].value = action.payload.newValue;
    },
    deleteTag(state, action: PayloadAction<{ id: number }>) {
      return state.filter((_, i) => i !== action.payload.id);
    },
  },
});

export const { addTag, changeTagKey, changeTagValue, deleteTag } =
  customTagsSlice.actions;

export const selectCustomTags = (state: RootState) => state.customTags;

export default customTagsSlice.reducer;
