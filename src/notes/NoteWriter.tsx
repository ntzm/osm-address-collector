import { Button, Modal, Stack, Textarea } from '@mantine/core'
import { useState } from 'react'
import { useBoundStore } from '../store'

export default function NoteWriter(props: {
  isOpened: boolean
  onClose: () => void
}) {
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
    props.onClose()
    setContent('')
  }

  return (
    <Modal opened={props.isOpened} onClose={close} title="Add a note">
      <Stack>
        <Textarea
          data-autofocus
          description={`${content.length}/255`}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={255}
        />
        <Button onClick={addNote}>Add</Button>
      </Stack>
    </Modal>
  )
}
