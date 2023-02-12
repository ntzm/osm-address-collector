import { it } from 'node:test'
import assert from 'node:assert/strict'
import { createBoundingBox, move } from '../src/geo'

it('moves position', () => {
  assert.deepEqual(
    move(
      {
        latitude: 51.509_74,
        longitude: -0.115_14,
      },
      45,
      50,
    ),
    {
      latitude: 51.510_057_601_307_48,
      longitude: -0.114_629_694_691_054_22,
    },
  )
})

it('creates a bounding box', () => {
  const boundingBox = createBoundingBox(
    {
      latitude: 51.509_74,
      longitude: -0.115_14,
    },
    10,
  )

  assert.deepEqual(
    boundingBox,
    [
      51.509_695_084_235_78, -0.115_212_167_565_788_6, 51.509_784_915_764_21,
      -0.115_067_832_434_211_4,
    ],
  )
})
