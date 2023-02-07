import { useState } from 'react'
import styled from 'styled-components'
import { useBoundStore } from '../store'

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

export default function NoteWriter(props: { onClose: () => void }) {
  const position = useBoundStore((s) => s.position)
  const [content, setContent] = useState('')
  const dispatchAddNote = useBoundStore((s) => s.addNote)

  const addNote = () => {
    if (position === undefined) {
      // todo type checking
      return
    }

    dispatchAddNote({
      latitude: position.latitude,
      longitude: position.longitude,
      content,
    })

    close()

    // todo
    // addAction('+ note')
  }

  const close = () => {
    setContent('')
    props.onClose()
  }

  return (
    <NoteWriterPopup>
      <button onClick={close} style={{ width: '100%', height: 40 }}>
        x
      </button>
      <p>Add a note</p>
      <textarea
        maxLength={255}
        style={{ height: '100%' }}
        value={content}
        onChange={(e) => setContent(e.target.value)}
      ></textarea>
      <button onClick={addNote}>Add</button>
    </NoteWriterPopup>
  )
}
