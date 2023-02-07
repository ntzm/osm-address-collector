import { Icon } from 'leaflet'
import { Marker, Popup } from 'react-leaflet'
import { Note } from '../types'
import iconUrl from '../../icons/edit_location.svg'

const icon = new Icon({
  iconUrl,
  iconSize: [36, 36],
  iconAnchor: [18, 36],
})

export default function NoteMarker(props: { note: Note }) {
  return (
    <Marker icon={icon} position={[props.note.latitude, props.note.longitude]}>
      <Popup>{props.note.content}</Popup>
    </Marker>
  )
}
