import { Icon } from "leaflet";
import { Marker, Popup } from "react-leaflet";
import { Address, Position } from "./types";
import iconUrl from '../icons/home_pin.svg'

const icon = new Icon({
  iconUrl,
  iconSize: [36, 36],
  iconAnchor: [18, 36],
})

export default function AddressMarker(props: {
  address: Address,
  onUpdatePosition: (position: Position) => void,
}) {
  return (
    <Marker
      eventHandlers={{ dragend: (e) => props.onUpdatePosition({ latitude: e.target.getLatLng().lat, longitude: e.target.getLatLng().lng }) }}
      draggable
      icon={icon}
      position={[props.address.latitude, props.address.longitude]}
    >
      <Popup>
        <strong>{props.address.numberOrName}</strong> {props.address.street}
      </Popup>
    </Marker>
  )
}
