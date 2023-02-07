import { SliceStateCreator } from './store'

export interface SkipNumbersSlice {
  skipNumbers: number[]
  addSkipNumber: (n: number) => void
  updateSkipNumber: (index: number, skipNumber: number) => void
  removeSkipNumber: (index: number) => void
}

export const createSkipNumbersSlice: SliceStateCreator<SkipNumbersSlice> = (
  set,
) => ({
  skipNumbers: [],
  addSkipNumber: (skipNumber: number) =>
    set((state) => {
      state.skipNumbers.push(skipNumber)
    }),
  updateSkipNumber: (index: number, skipNumber: number) =>
    set((state) => {
      state.skipNumbers[index] = skipNumber
    }),
  removeSkipNumber: (index: number) =>
    set((state) => {
      state.skipNumbers.splice(index, 1)
    }),
})
