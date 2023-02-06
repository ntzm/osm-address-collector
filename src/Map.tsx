import { MapContainer, TileLayer } from "react-leaflet";
import 'leaflet/dist/leaflet.css'
import styled from "styled-components";
import { Address, Note } from "./types";
import AddressMarker from "./AddressMarker";
import NoteMarker from "./NoteMarker";

const position: [number, number] = [51.505, -0.09]

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

interface MapProps {
  onClose: () => void
  addresses: Address[]
  notes: Note[]
}

function Map(props: MapProps) {
  return (
    <MapPopup>
      <CloseButton onClick={() => props.onClose()}>Close</CloseButton>
      <StyledMapContainer
        center={position}
        zoom={13}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {/* todo generate and use ids */}
        {props.addresses.map((address, i) => <AddressMarker key={i} address={address} />)}
        {props.notes.map((note, i) => <NoteMarker key={i} note={note} />)}
      </StyledMapContainer>
    </MapPopup>
  )
}

export default Map
