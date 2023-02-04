export function getOsmFile(
  domImplementation,
  serialize,
  addresses,
  notes,
  surveyStart,
) {
  const xml = domImplementation.createDocument('', '', null)
  const osm = xml.createElement('osm')
  osm.setAttribute('version', '0.6')
  osm.setAttribute('generator', 'OSM Address Collector')

  for (const [i, address] of addresses.entries()) {
    const node = xml.createElement('node')
    node.setAttribute('id', -surveyStart.getTime() - i)
    node.setAttribute('version', 1)
    node.setAttribute('lat', address.latitude)
    node.setAttribute('lon', address.longitude)

    const tag = xml.createElement('tag')

    if (isNaN(address.numberOrName.charAt(0))) {
      tag.setAttribute('k', 'addr:housename')
    } else {
      tag.setAttribute('k', 'addr:housenumber')
    }

    tag.setAttribute('v', address.numberOrName)

    node.append(tag)

    if (address.street) {
      const streetTag = xml.createElement('tag')
      streetTag.setAttribute('k', 'addr:street')
      streetTag.setAttribute('v', address.street)

      node.append(streetTag)
    }

    for (const [key, value] of Object.entries(address.customTags)) {
      if (value === '') {
        continue
      }

      const customTag = xml.createElement('tag')
      customTag.setAttribute('k', key)
      customTag.setAttribute('v', value)

      node.append(customTag)
    }

    osm.append(node)
  }

  for (const [i, note] of notes.entries()) {
    const node = xml.createElement('node')
    node.setAttribute('id', -surveyStart.getTime() - addresses.length - i)
    node.setAttribute('version', 1)
    node.setAttribute('lat', note.latitude)
    node.setAttribute('lon', note.longitude)

    const tag = xml.createElement('tag')
    tag.setAttribute('k', 'note')
    tag.setAttribute('v', note.content)

    node.append(tag)
    osm.append(node)
  }

  xml.append(osm)

  return serialize(xml)
}