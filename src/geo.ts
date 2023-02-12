import { type Position } from './types'

const EARTH_RADIUS_METRES = 6_378_137

function degreesToRadians(degrees: number) {
  return (degrees * Math.PI) / 180
}

function radiansToDegrees(radians: number) {
  return (radians * 180) / Math.PI
}

export function move(
  position: Position,
  bearing: number,
  distanceMetres: number,
): Position {
  const bearingRadians = degreesToRadians(bearing)

  const latitudeRadians = degreesToRadians(position.latitude)
  const longitudeRadians = degreesToRadians(position.longitude)

  const movedLatitudeRadians = Math.asin(
    Math.sin(latitudeRadians) * Math.cos(distanceMetres / EARTH_RADIUS_METRES) +
      Math.cos(latitudeRadians) *
        Math.sin(distanceMetres / EARTH_RADIUS_METRES) *
        Math.cos(bearingRadians),
  )
  const movedLongitudeRadians =
    longitudeRadians +
    Math.atan2(
      Math.sin(bearingRadians) *
        Math.sin(distanceMetres / EARTH_RADIUS_METRES) *
        Math.cos(latitudeRadians),
      Math.cos(distanceMetres / EARTH_RADIUS_METRES) -
        Math.sin(latitudeRadians) * Math.sin(movedLatitudeRadians),
    )

  return {
    latitude: radiansToDegrees(movedLatitudeRadians),
    longitude: radiansToDegrees(movedLongitudeRadians),
  }
}

export function createBoundingBox(
  position: Position,
  lengthMetres: number,
): [number, number, number, number] {
  return [
    move(position, 180, lengthMetres / 2).latitude,
    move(position, 270, lengthMetres / 2).longitude,
    move(position, 0, lengthMetres / 2).latitude,
    move(position, 90, lengthMetres / 2).longitude,
  ]
}
