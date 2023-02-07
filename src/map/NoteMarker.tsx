import { Icon } from 'leaflet'
import { Marker, Popup } from 'react-leaflet'
import { Note, Position } from '../types'
import iconUrl from '../../icons/edit_location.svg'

const icon = new Icon({
  iconUrl,
  iconSize: [36, 36],
  iconAnchor: [18, 36],
})

export default function NoteMarker(props: {
  note: Note
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
      position={[props.note.latitude, props.note.longitude]}
    >
      <Popup>
        {props.note.content}
        <button onClick={props.onDelete}>Delete</button>
      </Popup>
    </Marker>
  )
}
