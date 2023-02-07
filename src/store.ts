import { create, StateCreator } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { persist, devtools } from 'zustand/middleware'
import { AddressSlice, createAddressSlice } from './address-slice'
import { createNotesSlice, NotesSlice } from './notes-slice'
import { createSkipNumbersSlice, SkipNumbersSlice } from './skip-numbers-slice'
import { createCustomTagsSlice, CustomTagsSlice } from './custom-tags-slice'
import { createPositionSlice, PositionSlice } from './position-slice'
import { UnionToIntersection } from 'type-fest'
import { createStreetSlice, StreetSlice } from './street-slice'
import { createThrowDistanceSlice, ThrowDistanceSlice } from './throw-distance-slice'

type Slice = AddressSlice | NotesSlice | SkipNumbersSlice | CustomTagsSlice | PositionSlice | StreetSlice | ThrowDistanceSlice
export type State = UnionToIntersection<Slice>
export type SliceStateCreator<T extends Slice> = StateCreator<State, [["zustand/immer", never]], [], T>

const immerMiddleware = immer<State>((...a) => ({
  ...createAddressSlice(...a),
  ...createNotesSlice(...a),
  ...createSkipNumbersSlice(...a),
  ...createCustomTagsSlice(...a),
  ...createPositionSlice(...a),
  ...createStreetSlice(...a),
  ...createThrowDistanceSlice(...a),
}))

const persistMiddleware = persist(
  immerMiddleware,
  {
    name: 'storage',
    partialize: (state) => ({
      addresses: state.addresses,
      notes: state.notes,
      skipNumbers: state.skipNumbers,
      customTags: state.customTags,
      throwDistance: state.throwDistance,
    }),
  },
)

const devtoolsMiddleware = devtools(persistMiddleware)

export const useBoundStore = create(devtoolsMiddleware)
