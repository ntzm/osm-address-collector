import { ColorScheme } from '@mantine/core'
import { SliceStateCreator } from '../../store'

export interface GeneralSlice {
  throwDistance: number
  theme: ColorScheme
  updateThrowDistance: (throwDistance: number) => void
  resetThrowDistance: () => void
  updateTheme: (theme: ColorScheme) => void
  resetTheme: () => void
}

const DEFAULT_THROW_DISTANCE = 10
const DEFAULT_THEME: ColorScheme = 'light'

export const createGeneralSlice: SliceStateCreator<GeneralSlice> = (set) => ({
  throwDistance: DEFAULT_THROW_DISTANCE,
  theme: DEFAULT_THEME,
  updateThrowDistance: (throwDistance: number) =>
    set((state) => {
      state.throwDistance = throwDistance
    }),
  resetThrowDistance: () =>
    set((state) => {
      state.throwDistance = DEFAULT_THROW_DISTANCE
    }),
  updateTheme: (theme: ColorScheme) =>
    set((state) => {
      state.theme = theme
    }),
  resetTheme: () =>
    set((state) => {
      state.theme = DEFAULT_THEME
    }),
})
