import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { TextNote, TimedTextNote } from "./types";

const initialState: TimedTextNote[] = [];

const textNoteSlice = createSlice({
  name: "textNotes",
  initialState,
  reducers: {
    addTextNote(state, action: PayloadAction<TextNote>) {
      state.push({ timestamp: Date.now(), ...action.payload });
    },
  },
});

export const { addTextNote } = textNoteSlice.actions;

export const selectTextNotes = (state: RootState) => state.textNotes;

export default textNoteSlice.reducer;
