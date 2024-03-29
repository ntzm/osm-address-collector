import { Icon } from 'leaflet'
import { Marker, Popup } from 'react-leaflet'
import { Address, Position } from '../types'
import iconUrl from '../../icons/home_pin.svg'

const icon = new Icon({
  iconUrl,
  iconSize: [36, 36],
  iconAnchor: [18, 36],
})

export default function AddressMarker(props: {
  address: Address
  onUpdatePosition: (position: Position) => void
  onDelete: () => void
}) {
  return (
    <Marker
      eventHandlers={{
        dragend: (e) =>
          props.onUpdatePosition({
            latitude: e.target.getLatLng().lat,
            longitude: e.target.getLatLng().lng,
          }),
      }}
      draggable
      icon={icon}
      position={[props.address.latitude, props.address.longitude]}
    >
      <Popup>
        <strong>{props.address.numberOrName}</strong> {props.address.street}
        {props.address.customTags.length > 0 && (
          <table border={1}>
            <tbody>
              {props.address.customTags.map(({ key, value }) => (
                <tr key={key}>
                  <td>{key}</td>
                  <td>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <button onClick={props.onDelete}>Delete</button>
      </Popup>
    </Marker>
  )
}
