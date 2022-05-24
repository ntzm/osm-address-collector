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
export const selectLatestPositionId = (state: RootState) => {
  const latestPositionId = state.positions.length - 1;

  if (latestPositionId === -1) {
    throw new Error("No latest position");
  }

  return latestPositionId;
};

export default positionSlice.reducer;
