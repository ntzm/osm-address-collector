import { SliceStateCreator } from '../../store'

export interface StreetSlice {
  street: string
  streets: string[]
  updateStreet: (street: string) => void
  updateStreets: (street: string[]) => void
}

export const createStreetSlice: SliceStateCreator<StreetSlice> = (set) => ({
  street: '',
  streets: [],
  updateStreet: (street: string) =>
    set((state) => {
      state.street = street
    }),
  updateStreets: (streets: string[]) =>
    set((state) => {
      state.streets = streets
    }),
})
