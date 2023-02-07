import {it} from 'node:test'
import assert from 'node:assert/strict'
import {createBoundingBox, move} from '../src/geo'

it('moves position', () => {
  assert.deepEqual(
    move({
      latitude: 51.509_74,
      longitude: -0.115_14,
    }, 45, 50),
    {
      latitude: 51.51005795665431,
      longitude: -0.11462912373223058,
    },
  )
})

it('creates a bounding box', () => {
  const boundingBox = createBoundingBox({
    latitude: 51.509_74,
    longitude: -0.115_14,
  }, 10)

  assert.deepEqual(boundingBox, [
    51.50965006796363,
    -0.11528449662086664,
    51.50982993203638,
    -0.11499550337913336
  ])
})
