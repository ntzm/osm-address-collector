import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { TextNote } from "./types";

const initialState: TextNote[] = [];

const textNoteSlice = createSlice({
  name: "textNotes",
  initialState,
  reducers: {
    addTextNote(state, action: PayloadAction<TextNote>) {
      state.push(action.payload);
    },
  },
});

export const { addTextNote } = textNoteSlice.actions;

export const selectTextNotes = (state: RootState) => state.textNotes;

export default textNoteSlice.reducer;
