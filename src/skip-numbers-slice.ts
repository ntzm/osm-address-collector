import { SliceStateCreator } from './store'

export interface SkipNumbersSlice {
  skipNumbers: string[]
  addSkipNumber: () => void
  updateSkipNumber: (index: number, skipNumber: string) => void
  removeSkipNumber: (index: number) => void
  resetSkipNumbers: () => void
}

export const createSkipNumbersSlice: SliceStateCreator<SkipNumbersSlice> = (
  set,
) => ({
  skipNumbers: [],
  addSkipNumber: () =>
    set((state) => {
      state.skipNumbers.push('')
    }),
  updateSkipNumber: (index: number, skipNumber: string) =>
    set((state) => {
      state.skipNumbers[index] = skipNumber
    }),
  removeSkipNumber: (index: number) =>
    set((state) => {
      state.skipNumbers.splice(index, 1)
    }),
  resetSkipNumbers: () =>
    set((state) => {
      state.skipNumbers = []
    }),
})
