import { useState } from "react";
import styled from "styled-components";

const NoteWriterPopup = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  min-height: 100%;
  height: 100%;
  background: #fff;
  z-index: 5;
  flex-direction: column;
  padding: 5px;
  display: flex;
`

export default function NoteWriter(props: {
  onClose: () => void,
  onAdd: (content: string) => void,
}) {
  const [content, setContent] = useState('')

  const save = () => {
    props.onAdd(content)
    setContent('')
    props.onClose()
  }

  return <NoteWriterPopup>
    <button onClick={props.onClose} style={{ width: '100%', height: 40 }}>x</button>
    <p>Add a note</p>
    <textarea style={{ height: '100%' }} value={content} onChange={(e) => setContent(e.target.value)}></textarea>
    <button onClick={save}>Add</button>
  </NoteWriterPopup>
}
