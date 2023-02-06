import { Marker, Popup } from "react-leaflet";
import { Note } from "./types";

interface NoteMarkerProps {
  note: Note
}

export default function NoteMarker(props: NoteMarkerProps) {
  return (
    <Marker position={[props.note.latitude, props.note.longitude]}>
      <Popup>{props.note.content}</Popup>
    </Marker>
  )
}
