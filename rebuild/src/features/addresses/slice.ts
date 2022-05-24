import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
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

export const { addAddress } = addressSlice.actions;

export const selectAddresses = (state: RootState) => state.addresses;

export default addressSlice.reducer;
