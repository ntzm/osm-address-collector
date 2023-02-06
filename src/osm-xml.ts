import {type Address, type Note} from './types'

export function getOsmFile(
  domImplementation: DOMImplementation,
  serialize: (xml: XMLDocument) => string,
  addresses: Address[],
  notes: Note[],
  date: Date,
) {
  const xml = domImplementation.createDocument('', '', null)
  const osm = xml.createElement('osm')
  osm.setAttribute('version', '0.6')
  osm.setAttribute('generator', 'OSM Address Collector')

  for (const [i, address] of addresses.entries()) {
    const node = xml.createElement('node')
    node.setAttribute('id', String(-date.getTime() - i))
    node.setAttribute('version', '1')
    node.setAttribute('lat', String(address.latitude))
    node.setAttribute('lon', String(address.longitude))

    const tag = xml.createElement('tag')

    if (Number.isNaN(Number(address.numberOrName.charAt(0)))) {
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

    node.append(
      ...address.customTags.map(({ key, value }) => {
        if (value === '') {
          return ''
        }

        const customTag = xml.createElement('tag')
        customTag.setAttribute('k', key)
        customTag.setAttribute('v', value)
        return customTag
      })
    )

    osm.append(node)
  }

  for (const [i, note] of notes.entries()) {
    const node = xml.createElement('node')
    node.setAttribute('id', String(-date.getTime() - addresses.length - i))
    node.setAttribute('version', '1')
    node.setAttribute('lat', String(note.latitude))
    node.setAttribute('lon', String(note.longitude))

    const tag = xml.createElement('tag')
    tag.setAttribute('k', 'note')
    tag.setAttribute('v', note.content)

    node.append(tag)
    osm.append(node)
  }

  xml.append(osm)

  return serialize(xml)
}
