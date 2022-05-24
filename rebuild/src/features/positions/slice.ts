import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { Position, StoredPosition } from "./types";

const initialState: StoredPosition[] = [];

const positionSlice = createSlice({
  name: "positions",
  initialState,
  reducers: {
    addPosition: {
      reducer(state, action: PayloadAction<StoredPosition>) {
        state.push(action.payload);
      },
      prepare(position: Position) {
        return { payload: { timestamp: Date.now(), ...position } };
      },
    },
  },
});

export const { addPosition } = positionSlice.actions;

export const selectPositions = (state: RootState) => state.positions;
// todo this sucks if empty
export const selectLatestPositionId = (state: RootState) => state.positions.length - 1;

export default positionSlice.reducer;
