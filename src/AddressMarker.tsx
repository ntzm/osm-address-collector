import { Icon } from "leaflet";
import { Marker, Popup } from "react-leaflet";
import { Address } from "./types";
import iconUrl from '../icons/home_pin.svg'

const icon = new Icon({
  iconUrl,
  iconSize: [36, 36],
  iconAnchor: [18, 36],
})

export default function AddressMarker(props: {
  address: Address
}) {
  return (
    <Marker icon={icon} position={[props.address.latitude, props.address.longitude]}>
      <Popup>
        <strong>{props.address.numberOrName}</strong> {props.address.street}
      </Popup>
    </Marker>
  )
}
