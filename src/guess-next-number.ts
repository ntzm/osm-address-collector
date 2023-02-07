import { type Address } from './types'

export default function guessNextNumber(
  addresses: Address[],
  skipNumbers: number[],
): [undefined, []] | [number, number[]] {
  const defaultReturn = [undefined, []] as [undefined, []]

  const lastAddress = addresses[addresses.length - 1]
  const previous = addresses[addresses.length - 2]

  if (lastAddress === undefined || previous === undefined) {
    return defaultReturn
  }

  console.log(lastAddress, previous)

  const lNumber = Number(lastAddress.numberOrName)
  let pNumber = Number(previous.numberOrName)

  const justSkipped = lastAddress.skippedNumbers
  const lastJustSkipped = justSkipped[justSkipped.length - 1]

  if (lastJustSkipped !== undefined) {
    pNumber = lastJustSkipped
  }

  if (isNaN(lNumber) || isNaN(pNumber)) {
    return defaultReturn
  }

  const difference = lNumber - pNumber

  let nextNumber = lNumber + difference

  if (![-2, -1, 1, 2].includes(difference)) {
    return defaultReturn
  }

  const skippedNumbers = []

  while (skipNumbers.includes(nextNumber)) {
    skippedNumbers.push(nextNumber)
    nextNumber += difference
  }

  if (nextNumber < 1) {
    return defaultReturn
  }

  return [nextNumber, skippedNumbers]
}
