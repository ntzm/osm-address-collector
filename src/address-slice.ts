import { SliceStateCreator } from './store'
import { Address, Position } from './types'

export interface AddressSlice {
  addresses: Address[]
  addAddress: (address: Address) => void
  updateAddressPosition: (index: number, position: Position) => void
  removeAddress: (index: number) => void
  removeLastAddress: () => void
  clearAddresses: () => void
}

export const createAddressSlice: SliceStateCreator<AddressSlice> = (set) => ({
  addresses: [],
  addAddress: (address: Address) =>
    set((state) => {
      state.addresses.push(address)
    }),
  updateAddressPosition: (index: number, position: Position) =>
    set((state) => {
      const address = state.addresses[index]

      if (address === undefined) {
        return
      }

      state.addresses[index] = {
        ...address,
        ...position,
      }
    }),
  removeAddress: (index: number) =>
    set((state) => {
      state.addresses.splice(index, 1)
    }),
  removeLastAddress: () =>
    set((state) => {
      state.addresses.pop()
    }),
  clearAddresses: () =>
    set((state) => {
      state.addresses = []
    }),
})
