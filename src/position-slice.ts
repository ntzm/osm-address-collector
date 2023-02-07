import { SliceStateCreator } from './store'

export interface PositionSlice {
  position: GeolocationCoordinates | undefined
  updatePosition: (position: GeolocationCoordinates) => void
  clearPosition: () => void
}

export const createPositionSlice: SliceStateCreator<PositionSlice> = (set) => ({
  position: undefined,
  updatePosition: (position: GeolocationCoordinates) =>
    set((state) => {
      state.position = position
    }),
  clearPosition: () =>
    set((state) => {
      state.position = undefined
    }),
})
