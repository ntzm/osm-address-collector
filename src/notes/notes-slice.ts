import { SliceStateCreator } from '../store'
import { Note, Position } from '../types'

export interface NotesSlice {
  notes: Note[]
  addNote: (note: Note) => void
  clearNotes: () => void
  updateNotePosition: (index: number, position: Position) => void
  removeNote: (index: number) => void
}

export const createNotesSlice: SliceStateCreator<NotesSlice> = (set) => ({
  notes: [],
  addNote: (note: Note) =>
    set((state) => {
      state.notes.push(note)
    }),
  clearNotes: () =>
    set((state) => {
      state.notes = []
    }),
  updateNotePosition: (index: number, position: Position) =>
    set((state) => {
      const note = state.notes[index]

      if (note === undefined) {
        return
      }

      state.notes[index] = {
        ...note,
        ...position,
      }
    }),
  removeNote: (index: number) =>
    set((state) => {
      state.notes.splice(index, 1)
    }),
})
