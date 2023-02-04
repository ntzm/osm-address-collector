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

export function compassHeading(alpha, beta, gamma) {
  const alphaRad = degreesToRadians(alpha)
  const betaRad = degreesToRadians(beta)
  const gammaRad = degreesToRadians(gamma)

  const cA = Math.cos(alphaRad)
  const sA = Math.sin(alphaRad)
  const sB = Math.sin(betaRad)
  const cG = Math.cos(gammaRad)
  const sG = Math.sin(gammaRad)

  const rA = -cA * sG - sA * sB * cG
  const rB = -sA * sG + cA * sB * cG

  let compassHeading = Math.atan(rA / rB)

  if (rB < 0) {
    compassHeading += Math.PI
  } else if (rA < 0) {
    compassHeading += 2 * Math.PI
  }

  return radiansToDegrees(compassHeading)
}
