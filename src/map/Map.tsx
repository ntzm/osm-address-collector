import { MapContainer, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import styled from 'styled-components'
import AddressMarker from './AddressMarker'
import NoteMarker from './NoteMarker'
import { useBoundStore } from '../store'

const MapPopup = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  min-height: 100%;
  height: 100%;
  background: #fff;
  z-index: 5;
`

const CloseButton = styled.button`
  position: absolute;
  top: 5px;
  left: 5px;
  z-index: 1000;
  font-size: 14pt;
`

const StyledMapContainer = styled(MapContainer)`
  height: 100%;
  width: 100%;
`

export default function Map(props: { onClose: () => void }) {
  const addresses = useBoundStore((s) => s.addresses)
  const updateAddressPosition = useBoundStore((s) => s.updateAddressPosition)
  const removeAddress = useBoundStore((s) => s.removeAddress)

  const notes = useBoundStore((s) => s.notes)
  const updateNotePosition = useBoundStore((s) => s.updateNotePosition)
  const removeNote = useBoundStore((s) => s.removeNote)

  const position = useBoundStore((s) => s.position)

  return (
    <MapPopup>
      <CloseButton onClick={() => props.onClose()}>Close</CloseButton>
      <StyledMapContainer
        center={position ? [position.latitude, position.longitude] : [0, 0]}
        zoom={18}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxNativeZoom={18}
          maxZoom={20}
        />
        {/* todo generate and use ids */}
        {addresses.map((address, i) => (
          <AddressMarker
            onUpdatePosition={(position) => updateAddressPosition(i, position)}
            onDelete={() => removeAddress(i)}
            key={i}
            address={address}
          />
        ))}
        {notes.map((note, i) => (
          <NoteMarker
            onUpdatePosition={(position) => updateNotePosition(i, position)}
            onDelete={() => removeNote(i)}
            key={i}
            note={note}
          />
        ))}
      </StyledMapContainer>
    </MapPopup>
  )
}
