import { SliceStateCreator } from './store'
import { HeadingProvider } from './types'

export interface PositionSlice {
  position: GeolocationCoordinates | undefined
  heading: number | undefined
  headingProvider: HeadingProvider
  updatePosition: (position: GeolocationCoordinates) => void
  clearPosition: () => void
  updateHeading: (heading: number) => void
  clearHeading: () => void
  updateHeadingProvider: (headingProvider: HeadingProvider) => void
  clearHeadingProvider: () => void
}

export const createPositionSlice: SliceStateCreator<PositionSlice> = (set) => ({
  position: undefined,
  heading: undefined,
  headingProvider: undefined,
  updatePosition: (position: GeolocationCoordinates) =>
    set((state) => {
      state.position = position
    }),
  clearPosition: () =>
    set((state) => {
      state.position = undefined
    }),
  updateHeading: (heading: number) =>
    set((state) => {
      state.heading = heading
    }),
  clearHeading: () =>
    set((state) => {
      state.heading = undefined
    }),
  updateHeadingProvider: (headingProvider: HeadingProvider) =>
    set((state) => {
      state.headingProvider = headingProvider
    }),
  clearHeadingProvider: () =>
    set((state) => {
      state.headingProvider = undefined
    }),
})
