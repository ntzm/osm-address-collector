import bbox from '@turf/bbox'
import buffer from '@turf/buffer'
import destination from '@turf/destination'
import {type Position} from './types'

function positionToLonLat(position: Position): number[] {
  return [position.longitude, position.latitude]
}

function lonLatToPosition(lonLat: [number, number]): Position {
  return { longitude: lonLat[0], latitude: lonLat[1] }
}

export function move(
  position: Position,
  bearing: number,
  distanceMetres: number,
): Position {
  const dest = destination(
    positionToLonLat(position),
    distanceMetres,
    bearing,
    { units: 'meters' }
  )

  return lonLatToPosition(dest.geometry.coordinates as [number, number])
}

export function createBoundingBox(
  position: Position,
  lengthMetres: number,
) {
  const [minX, minY, maxX, maxY] = bbox(
    buffer(
      { type: 'Point', coordinates: positionToLonLat(position) },
      lengthMetres,
      { units: 'meters' },
    )
  )

  return [minY, minX, maxY, maxX]
}
