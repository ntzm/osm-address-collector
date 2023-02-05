const EARTH_RADIUS_METRES = 6_378_137

function degreesToRadians(degrees) {
  return (degrees * Math.PI) / 180
}

function radiansToDegrees(radians) {
  return (radians * 180) / Math.PI
}

export function move(position, bearing, distanceMetres) {
  const bearingRadians = degreesToRadians(bearing)

  const latitudeRadians = degreesToRadians(position.latitude)
  const longitudeRadians = degreesToRadians(position.longitude)

  const movedLatitudeRadians = Math.asin(
    Math.sin(latitudeRadians) * Math.cos(distanceMetres / EARTH_RADIUS_METRES)
      + Math.cos(latitudeRadians)
        * Math.sin(distanceMetres / EARTH_RADIUS_METRES)
        * Math.cos(bearingRadians),
  )
  const movedLongitudeRadians
    = longitudeRadians
    + Math.atan2(
      Math.sin(bearingRadians)
        * Math.sin(distanceMetres / EARTH_RADIUS_METRES)
        * Math.cos(latitudeRadians),
      Math.cos(distanceMetres / EARTH_RADIUS_METRES)
        - Math.sin(latitudeRadians) * Math.sin(movedLatitudeRadians),
    )

  return {
    latitude: radiansToDegrees(movedLatitudeRadians),
    longitude: radiansToDegrees(movedLongitudeRadians),
  }
}

/**
 * @param {GeolocationCoordinates} position
 * @param {Number} lengthMetres
 *
 * @returns {[Number, Number, Number, Number]} In the order of:
 *          - southern-most latitude
 *          - western-most longitude
 *          - northern-most latitude
 *          - eastern-most longitude
 */
export function createBoundingBox(position, lengthMetres) {
  return [
    move(position, 180, lengthMetres / 2).latitude,
    move(position, 270, lengthMetres / 2).longitude,
    move(position, 0, lengthMetres / 2).latitude,
    move(position, 90, lengthMetres / 2).longitude,
  ]
}
