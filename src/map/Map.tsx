import {
  LayerGroup,
  LayersControl,
  MapContainer,
  Marker,
  TileLayer,
} from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import styled from 'styled-components'
import AddressMarker from './AddressMarker'
import NoteMarker from './NoteMarker'
import { useBoundStore } from '../store'
import { useState } from 'react'
import circle from '@tabler/icons/circle-filled.svg'
import { Icon } from 'leaflet'

const StyledMapContainer = styled(MapContainer)`
  height: 100%;
  width: 100%;
`

export default function Map() {
  const addresses = useBoundStore((s) => s.addresses)
  const updateAddressPosition = useBoundStore((s) => s.updateAddressPosition)
  const removeAddress = useBoundStore((s) => s.removeAddress)

  const notes = useBoundStore((s) => s.notes)
  const updateNotePosition = useBoundStore((s) => s.updateNotePosition)
  const removeNote = useBoundStore((s) => s.removeNote)

  const position = useBoundStore((s) => s.position)

  const theme = useBoundStore((s) => s.theme)

  // this is probably the wrong way to do this
  const [initialPosition, setInitialPosition] = useState<
    GeolocationCoordinates | undefined
  >(undefined)
  if (!initialPosition) {
    setInitialPosition(position)
  }

  return (
    <StyledMapContainer
      center={
        initialPosition
          ? [initialPosition.latitude, initialPosition.longitude]
          : [0, 0]
      }
      zoom={18}
      zoomControl={false}
      style={
        theme === 'dark'
          ? {
              filter:
                'brightness(0.6) invert(1) contrast(3) hue-rotate(200deg) saturate(0.3) brightness(0.7)',
            }
          : {}
      }
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        maxNativeZoom={18}
        maxZoom={20}
      />
      <LayerGroup>
        {position && (
          <Marker
            position={[position.latitude, position.longitude]}
            icon={
              new Icon({
                iconUrl: circle,
                iconSize: [12, 12],
                iconAnchor: [6, 6],
              })
            }
          />
        )}
      </LayerGroup>
      <LayersControl position="topright">
        {/* todo generate and use ids */}
        <LayersControl.Overlay checked name="Addresses">
          <LayerGroup>
            {addresses.map((address, i) => (
              <AddressMarker
                onUpdatePosition={(position) =>
                  updateAddressPosition(i, position)
                }
                onDelete={() => removeAddress(i)}
                key={i}
                address={address}
              />
            ))}
          </LayerGroup>
        </LayersControl.Overlay>
        <LayersControl.Overlay checked name="Notes">
          <LayerGroup>
            {notes.map((note, i) => (
              <NoteMarker
                onUpdatePosition={(position) => updateNotePosition(i, position)}
                onDelete={() => removeNote(i)}
                key={i}
                note={note}
              />
            ))}
          </LayerGroup>
        </LayersControl.Overlay>
      </LayersControl>
    </StyledMapContainer>
  )
}
