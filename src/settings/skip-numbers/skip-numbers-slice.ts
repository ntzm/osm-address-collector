import { SliceStateCreator } from '../../store'

export interface SkipNumbersSlice {
  skipNumbers: string[]
  updateSkipNumbers: (skipNumbers: string[]) => void
  resetSkipNumbers: () => void
}

export const createSkipNumbersSlice: SliceStateCreator<SkipNumbersSlice> = (
  set,
) => ({
  skipNumbers: [],
  updateSkipNumbers: (skipNumbers: string[]) =>
    set((state) => {
      state.skipNumbers = skipNumbers
    }),
  resetSkipNumbers: () =>
    set((state) => {
      state.skipNumbers = []
    }),
})
