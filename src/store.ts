import { create, StateCreator } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { persist, devtools } from 'zustand/middleware'
import { AddressSlice, createAddressSlice } from './address-slice'
import { createNotesSlice, NotesSlice } from './notes/notes-slice'
import {
  createSkipNumbersSlice,
  SkipNumbersSlice,
} from './settings/skip-numbers/skip-numbers-slice'
import {
  createCustomTagsSlice,
  CustomTagsSlice,
} from './settings/custom-tags/custom-tags-slice'
import { createPositionSlice, PositionSlice } from './position-slice'
import { UnionToIntersection } from 'type-fest'
import { createStreetSlice, StreetSlice } from './settings/street/street-slice'
import {
  createGeneralSlice,
  GeneralSlice,
} from './settings/general/general-slice'
import {
  createOverpassSlice,
  OverpassSlice,
} from './settings/advanced/overpass-slice'

type Slice =
  | AddressSlice
  | NotesSlice
  | SkipNumbersSlice
  | CustomTagsSlice
  | PositionSlice
  | StreetSlice
  | GeneralSlice
  | OverpassSlice
export type State = UnionToIntersection<Slice>
export type SliceStateCreator<T extends Slice> = StateCreator<
  State,
  [['zustand/immer', never]],
  [],
  T
>

const immerMiddleware = immer<State>((...a) => ({
  ...createAddressSlice(...a),
  ...createNotesSlice(...a),
  ...createSkipNumbersSlice(...a),
  ...createCustomTagsSlice(...a),
  ...createPositionSlice(...a),
  ...createStreetSlice(...a),
  ...createGeneralSlice(...a),
  ...createOverpassSlice(...a),
}))

const persistMiddleware = persist(immerMiddleware, {
  name: 'storage',
  partialize: (state) => ({
    addresses: state.addresses,
    notes: state.notes,
    skipNumbers: state.skipNumbers,
    customTags: state.customTags,
    throwDistance: state.throwDistance,
    overpassEndpoint: state.overpassEndpoint,
    overpassTimeout: state.overpassTimeout,
    streetSearchDistance: state.streetSearchDistance,
  }),
})

const devtoolsMiddleware = devtools(persistMiddleware)

export const useBoundStore = create(devtoolsMiddleware)
