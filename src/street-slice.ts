import { SliceStateCreator } from "./store"

export interface StreetSlice {
  street: string
  updateStreet: (street: string) => void
}

export const createStreetSlice: SliceStateCreator<StreetSlice> = (set) => ({
  street: '',
  updateStreet: (street: string) => set((state) => {
    state.street = street
  }),
})
