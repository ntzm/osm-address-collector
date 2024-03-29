import { SliceStateCreator } from '../../store'

export interface OverpassSlice {
  overpassTimeout: number
  overpassEndpoint: string
  streetSearchDistance: number
  updateOverpassTimeout: (overpassTimeout: number) => void
  resetOverpassTimeout: () => void
  updateOverpassEndpoint: (overpassEndpoint: string) => void
  resetOverpassEndpoint: () => void
  updateStreetSearchDistance: (streetSearchDistance: number) => void
  resetStreetSearchDistance: () => void
}

const DEFAULT_OVERPASS_TIMEOUT = 10000
const DEFAULT_OVERPASS_ENDPOINT = 'https://overpass-api.de/api/interpreter'
const DEFAULT_STREET_SEARCH_DISTANCE = 10

export const createOverpassSlice: SliceStateCreator<OverpassSlice> = (set) => ({
  overpassTimeout: DEFAULT_OVERPASS_TIMEOUT,
  overpassEndpoint: DEFAULT_OVERPASS_ENDPOINT,
  streetSearchDistance: DEFAULT_STREET_SEARCH_DISTANCE,
  updateOverpassTimeout: (overpassTimeout: number) =>
    set((state) => {
      state.overpassTimeout = overpassTimeout
    }),
  resetOverpassTimeout: () =>
    set((state) => {
      state.overpassTimeout = DEFAULT_OVERPASS_TIMEOUT
    }),
  updateOverpassEndpoint: (overpassEndpoint: string) =>
    set((state) => {
      state.overpassEndpoint = overpassEndpoint
    }),
  resetOverpassEndpoint: () =>
    set((state) => {
      state.overpassEndpoint = DEFAULT_OVERPASS_ENDPOINT
    }),
  updateStreetSearchDistance: (streetSearchDistance: number) =>
    set((state) => {
      state.streetSearchDistance = streetSearchDistance
    }),
  resetStreetSearchDistance: () =>
    set((state) => {
      state.streetSearchDistance = DEFAULT_STREET_SEARCH_DISTANCE
    }),
})
