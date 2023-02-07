import { SliceStateCreator } from "./store"

export interface ThrowDistanceSlice {
  throwDistance: number
  updateThrowDistance: (throwDistance: number) => void
}

export const createThrowDistanceSlice: SliceStateCreator<ThrowDistanceSlice> = (set) => ({
  throwDistance: 10,
  updateThrowDistance: (throwDistance: number) => set((state) => {
    state.throwDistance = throwDistance
  })
})
