import createBoundingBox from './create-bounding-box.mjs'
import overpassQuery from './overpass.mjs'

/**
 * @param {GeolocationCoordinates} position
 * @param {Number} searchMetres
 * @returns {String[]}
 */
export default async function findNearestStreets(position, searchMetres, endpoint, timeout) {
  const query = `[out:json]\
[bbox:${createBoundingBox(position, searchMetres + position.accuracy).join(',')}];\
way[highway][name];\
for(t["name"])\
(make x name=_.val;out;);`

  const elements = await overpassQuery(endpoint, query, timeout)
  return elements.map(element => element.tags.name)
}
