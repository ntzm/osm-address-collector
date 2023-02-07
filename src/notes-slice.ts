import { SliceStateCreator } from './store'
import { Note } from './types'

export interface NotesSlice {
  notes: Note[]
  addNote: (note: Note) => void
}

export const createNotesSlice: SliceStateCreator<NotesSlice> = (set) => ({
  notes: [],
  addNote: (note: Note) =>
    set((state) => {
      state.notes.push(note)
    }),
})
