import { SliceStateCreator } from '../store'

export interface ThrowDistanceSlice {
  throwDistance: number
  updateThrowDistance: (throwDistance: number) => void
  resetThrowDistance: () => void
}

const DEFAULT = 10

export const createThrowDistanceSlice: SliceStateCreator<ThrowDistanceSlice> = (
  set,
) => ({
  throwDistance: DEFAULT,
  updateThrowDistance: (throwDistance: number) =>
    set((state) => {
      state.throwDistance = throwDistance
    }),
  resetThrowDistance: () =>
    set((state) => {
      state.throwDistance = DEFAULT
    }),
})
