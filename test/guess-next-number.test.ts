import { it } from 'node:test'
import assert from 'node:assert/strict'
import guessNextNumber from '../src/guess-next-number'
import { type Address } from '../src/types'

function makeAddresses(...numbers: number[]): Address[] {
  return numbers.map((number) => makeAddress({ numberOrName: String(number) }))
}

function makeAddress(address: Partial<Address>): Address {
  return {
    latitude: 0,
    longitude: 0,
    numberOrName: '1',
    skippedNumbers: [],
    street: undefined,
    customTags: [],
    direction: 'L',
    ...address,
  }
}

it('guesses basic next number, 2 step', () => {
  assert.deepEqual([14, []], guessNextNumber(makeAddresses(10, 12), []))
})

it('guesses basic next number, 1 step', () => {
  assert.deepEqual([12, []], guessNextNumber(makeAddresses(10, 11), []))
})

it('guesses basic next number, -1 step', () => {
  assert.deepEqual([9, []], guessNextNumber(makeAddresses(11, 10), []))
})

it('guesses basic next number, -2 step', () => {
  assert.deepEqual([8, []], guessNextNumber(makeAddresses(12, 10), []))
})

it('skips given number, 2 step', () => {
  assert.deepEqual([15, [13]], guessNextNumber(makeAddresses(9, 11), [13]))
})

it('skips given number, 1 step', () => {
  assert.deepEqual([14, [13]], guessNextNumber(makeAddresses(11, 12), [13]))
})

it('skips given number, -1 step', () => {
  assert.deepEqual([12, [13]], guessNextNumber(makeAddresses(15, 14), [13]))
})

it('skips given number, -2 step', () => {
  assert.deepEqual([11, [13]], guessNextNumber(makeAddresses(17, 15), [13]))
})

it('skips multiple, 2 step', () => {
  assert.deepEqual(
    [17, [13, 15]],
    guessNextNumber(makeAddresses(9, 11), [13, 15]),
  )
})

it('skips multiple, 1 step', () => {
  assert.deepEqual(
    [16, [14, 15]],
    guessNextNumber(makeAddresses(12, 13), [14, 15]),
  )
})

it('skips multiple, -1 step', () => {
  assert.deepEqual(
    [13, [15, 14]],
    guessNextNumber(makeAddresses(17, 16), [14, 15]),
  )
})

it('skips multiple, -2 step', () => {
  assert.deepEqual(
    [12, [16, 14]],
    guessNextNumber(makeAddresses(20, 18), [14, 16]),
  )
})

it('handles one skipped number, 2 step', () => {
  assert.deepEqual(
    guessNextNumber(
      [
        makeAddress({ numberOrName: '11', skippedNumbers: [] }),
        makeAddress({ numberOrName: '15', skippedNumbers: [13] }),
      ],
      [],
    ),
    [17, []],
  )
})

it('handles one skipped number, 1 step', () => {
  assert.deepEqual(
    guessNextNumber(
      [
        makeAddress({ numberOrName: '12', skippedNumbers: [] }),
        makeAddress({ numberOrName: '14', skippedNumbers: [13] }),
      ],
      [],
    ),
    [15, []],
  )
})

it('handles one skipped number, -1 step', () => {
  assert.deepEqual(
    guessNextNumber(
      [
        makeAddress({ numberOrName: '14', skippedNumbers: [] }),
        makeAddress({ numberOrName: '12', skippedNumbers: [13] }),
      ],
      [],
    ),
    [11, []],
  )
})

it('handles one skipped number, -2 step', () => {
  assert.deepEqual(
    guessNextNumber(
      [
        makeAddress({ numberOrName: '15', skippedNumbers: [] }),
        makeAddress({ numberOrName: '11', skippedNumbers: [13] }),
      ],
      [],
    ),
    [9, []],
  )
})

it('handles multiple skipped numbers, 2 step', () => {
  assert.deepEqual(
    guessNextNumber(
      [
        makeAddress({ numberOrName: '11', skippedNumbers: [] }),
        makeAddress({ numberOrName: '17', skippedNumbers: [13, 15] }),
      ],
      [],
    ),
    [19, []],
  )
})

it('handles multiple skipped numbers, 1 step', () => {
  assert.deepEqual(
    guessNextNumber(
      [
        makeAddress({ numberOrName: '12', skippedNumbers: [] }),
        makeAddress({ numberOrName: '15', skippedNumbers: [13, 14] }),
      ],
      [],
    ),
    [16, []],
  )
})

it('handles multiple skipped numbers, -1 step', () => {
  assert.deepEqual(
    guessNextNumber(
      [
        makeAddress({ numberOrName: '15', skippedNumbers: [] }),
        makeAddress({ numberOrName: '12', skippedNumbers: [14, 13] }),
      ],
      [],
    ),
    [11, []],
  )
})

it('handles multiple skipped numbers, -2 step', () => {
  assert.deepEqual(
    guessNextNumber(
      [
        makeAddress({ numberOrName: '16', skippedNumbers: [] }),
        makeAddress({ numberOrName: '10', skippedNumbers: [14, 12] }),
      ],
      [],
    ),
    [8, []],
  )
})
