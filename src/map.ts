import Feature from 'ol/Feature'
import Map from 'ol/Map.js'
import {Point} from 'ol/geom'
import {circular as circularPolygon} from 'ol/geom/Polygon'
import View from 'ol/View.js'
import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style.js'
import {OSM, Vector as VectorSource} from 'ol/source.js'
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer'
import {useGeographic} from 'ol/proj'
import {type State} from './state'

export function makeMap(state: State) {
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

  const addressMarkerStyle = new Style({
    image: new CircleStyle({
      radius: 6,
      fill: new Fill({
        color: '#0000ff',
      }),
      stroke: new Stroke({
        color: '#000',
        width: 2,
      }),
    }),
  })

  state.addresses.subscribe(({value}) => {
    addressSource.clear()

    addressSource.addFeatures(value.map(address => {
      const feature = new Feature({
        geometry: new Point([address.longitude, address.latitude]),
      })

      feature.setStyle(addressMarkerStyle)

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

  state.notes.subscribe(({value}) => {
    noteSource.clear()

    noteSource.addFeatures(value.map(note => {
      const feature = new Feature({
        geometry: new Point([note.longitude, note.latitude]),
      })

      feature.setStyle(noteMarkerStyle)

      return feature
    }))
  })

  state.position.subscribe(({value}) => {
    positionFeature.setGeometry(new Point([value.longitude, value.latitude]))
    accuracyFeature.setGeometry(circularPolygon([value.longitude, value.latitude], value.accuracy))
    map.getView().setCenter([value.longitude, value.latitude])
  })
}
