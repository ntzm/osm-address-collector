import { SliceStateCreator } from '../store'
import { CustomTag } from '../types'

export interface CustomTagsSlice {
  customTags: CustomTag[]
  addCustomTag: (customTag: CustomTag) => void
  updateCustomTagKey: (index: number, key: string) => void
  updateCustomTagValue: (index: number, value: string) => void
  removeCustomTag: (index: number) => void
  resetCustomTags: () => void
}

export const createCustomTagsSlice: SliceStateCreator<CustomTagsSlice> = (
  set,
) => ({
  customTags: [],
  addCustomTag: (customTag: CustomTag) =>
    set((state) => {
      state.customTags.push(customTag)
    }),
  updateCustomTagKey: (index: number, key: string) =>
    set((state) => {
      const customTag = state.customTags[index]
      if (customTag === undefined) {
        return
      }

      customTag.key = key
    }),
  updateCustomTagValue: (index: number, value: string) =>
    set((state) => {
      const customTag = state.customTags[index]
      if (customTag === undefined) {
        return
      }

      customTag.value = value
    }),
  removeCustomTag: (index: number) =>
    set((state) => {
      state.customTags.splice(index, 1)
    }),
  resetCustomTags: () =>
    set((state) => {
      state.customTags = []
    }),
})
