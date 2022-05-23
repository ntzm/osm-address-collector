import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { Position } from "./types";

const initialState: Position[] = [];

const positionSlice = createSlice({
  name: "positions",
  initialState,
  reducers: {
    addPosition(state, action: PayloadAction<Position>) {
      state.push(action.payload);
    },
  },
});

export const { addPosition } = positionSlice.actions;

export const selectPositions = (state: RootState) => state.positions;
export const selectLatestPosition = (state: RootState) => {
  const latestPosition = state.positions.at(-1);

  if (latestPosition === undefined) {
    throw "No latest position";
  }

  return latestPosition;
};

export default positionSlice.reducer;
