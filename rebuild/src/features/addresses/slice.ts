import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk, RootState } from "../../app/store";
import { selectLatestPositionId } from "../positions/slice";
import { Direction } from "./enums";
import { Address } from "./types";

const initialState: Address[] = [];

const addressSlice = createSlice({
  name: "addresses",
  initialState,
  reducers: {
    addAddress(state, action: PayloadAction<Address>) {
      state.push(action.payload);
    },
  },
});

export const addAddress =
  (nameOrNumber: string, direction: Direction): AppThunk =>
  (dispatch, getState) => {
    const positionId = selectLatestPositionId(getState());
    dispatch(
      addressSlice.actions.addAddress({
        nameOrNumber,
        direction,
        positionId,
      })
    );
  };

export const selectAddresses = (state: RootState) => state.addresses;

export default addressSlice.reducer;
