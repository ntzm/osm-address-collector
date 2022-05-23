import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { Address, TimedAddress } from "./types";

const initialState: TimedAddress[] = [];

const addressSlice = createSlice({
  name: "addresses",
  initialState,
  reducers: {
    addAddress(state, action: PayloadAction<Address>) {
      state.push({ timestamp: Date.now(), ...action.payload });
    },
  },
});

export const { addAddress } = addressSlice.actions;

export const selectAddresses = (state: RootState) => state.addresses;

export default addressSlice.reducer;
