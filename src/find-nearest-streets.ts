import { createBoundingBox } from './geo'
import overpassQuery from './overpass'

export default async function findNearestStreets(
  position: GeolocationCoordinates,
  searchMetres: number,
  endpoint: string,
  timeout: number,
): Promise<string[]> {
  const query = `[out:json]\
[bbox:${createBoundingBox(
    position,
    searchMetres + Math.min(position.accuracy, 20),
  ).join(',')}];\
way[highway][name];\
for(t["name"])\
(make x name=_.val;out;);`

  const elements = await overpassQuery(endpoint, query, timeout)
  return elements.map((element) => element.tags.name)
}
