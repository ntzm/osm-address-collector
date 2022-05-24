import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk, RootState } from "../../app/store";
import { selectLatestPositionId } from "../positions/slice";
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

export const addTextNote =
  (content: string): AppThunk =>
  (dispatch, getState) => {
    const positionId = selectLatestPositionId(getState());
    dispatch(
      textNoteSlice.actions.addTextNote({
        content,
        positionId,
      })
    );
  };

export const selectTextNotes = (state: RootState) => state.textNotes;

export default textNoteSlice.reducer;
