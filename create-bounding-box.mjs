const EARTH_RADIUS_METRES = 6_378_137

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
export default function createBoundingBox(position, lengthMetres) {
  return [
    moveLatitude(position, -lengthMetres / 2),
    moveLongitude(position, -lengthMetres / 2),
    moveLatitude(position, lengthMetres / 2),
    moveLongitude(position, lengthMetres / 2),
  ]
}

/**
 * @param {GeolocationCoordinates} position
 * @param {Number} distanceMetres
 * @returns {Number}
 */
function moveLatitude(position, distanceMetres) {
  return position.latitude + (distanceMetres / EARTH_RADIUS_METRES) * (180 / Math.PI)
}

/**
 * @param {GeolocationCoordinates} position
 * @param {Number} distanceMetres
 * @returns {Number}
 */
function moveLongitude(position, distanceMetres) {
  return position.longitude + (distanceMetres / EARTH_RADIUS_METRES) * (180 / Math.PI) / Math.cos(position.latitude * Math.PI / 180)
}
