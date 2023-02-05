import Feature from 'ol/Feature'
import Map from 'ol/Map.js'
import {Point} from 'ol/geom'
import {circular as circularPolygon} from 'ol/geom/Polygon'
import View from 'ol/View.js'
import {Circle as CircleStyle, Fill, Stroke, Style, Text} from 'ol/style.js'
import {OSM, Vector as VectorSource} from 'ol/source.js'
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer'
import {useGeographic} from 'ol/proj'
import {Attribution, Rotate} from 'ol/control'
import {type State} from './state'
import { Note } from './types'

export function makeMap(state: State): Map {
  useGeographic()

  const map = new Map({
    target: 'map',
    layers: [
      new TileLayer({
        source: new OSM(),
      }),
    ],
    view: new View({
      center: [0, 0],
      zoom: 19,
    }),
    controls: [
      new Attribution(),
      new Rotate(),
    ],
  })

  const accuracyFeature = new Feature()
  const positionFeature = new Feature()
  positionFeature.setStyle(
    new Style({
      image: new CircleStyle({
        radius: 6,
        fill: new Fill({
          color: '#3399CC',
        }),
        stroke: new Stroke({
          color: '#fff',
          width: 2,
        }),
      }),
    }),
  )

  const positionLayer = new VectorLayer({
    source: new VectorSource({
      features: [accuracyFeature, positionFeature],
    }),
  })

  map.addLayer(positionLayer)

  const addressSource = new VectorSource({features: []})

  const addressLayer = new VectorLayer({
    source: addressSource,
  })

  map.addLayer(addressLayer)

  state.addresses.subscribe(({value}) => {
    addressSource.clear()

    addressSource.addFeatures(value.map(address => {
      const feature = new Feature({
        geometry: new Point([address.longitude, address.latitude]),
      })

      feature.setStyle(
        new Style({
          text: new Text({
            text: address.numberOrName,
            scale: 1.2,
            fill: new Fill({ color: '#fff' }),
            stroke: new Stroke({ color: '0', width: 3}),
          }),
        })
      )

      return feature
    }))
  })

  const noteSource = new VectorSource({features: []})

  const noteLayer = new VectorLayer({
    source: noteSource,
  })

  map.addLayer(noteLayer)

  const noteMarkerStyle = new Style({
    image: new CircleStyle({
      radius: 6,
      fill: new Fill({
        color: '#ff0000',
      }),
      stroke: new Stroke({
        color: '#000',
        width: 2,
      }),
    }),
  })

  const updateNotes = (notes: Note[]) => {
    noteSource.clear()

    noteSource.addFeatures(notes.map(note => {
      const feature = new Feature({
        geometry: new Point([note.longitude, note.latitude]),
      })

      feature.setStyle(noteMarkerStyle)

      return feature
    }))
  }

  state.notes.subscribe(({value}) => {
    updateNotes(value)
  })

  updateNotes(state.notes.value)

  const updatePosition = (position: GeolocationCoordinates | undefined) => {
    if (position === undefined) {
      return
    }

    positionFeature.setGeometry(new Point([position.longitude, position.latitude]))
    accuracyFeature.setGeometry(circularPolygon([position.longitude, position.latitude], position.accuracy))
  }

  state.position.subscribe(({value}) => {
    updatePosition(value)
  })

  updatePosition(state.position.value)

  return map
}
