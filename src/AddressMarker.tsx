import { Marker, Popup } from "react-leaflet";
import { Address } from "./types";

interface AddressMarkerProps {
  address: Address
}

export default function AddressMarker(props: AddressMarkerProps) {
  return (
    <Marker position={[props.address.latitude, props.address.longitude]}>
      <Popup>{props.address.numberOrName} {props.address.street}</Popup>
    </Marker>
  )
}
