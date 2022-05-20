import { SpeakerNotes, CameraAlt, Mic } from "@mui/icons-material";
import {
  SpeedDial,
  SpeedDialIcon,
  SpeedDialAction,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
} from "@mui/material";
import React from "react";

interface NotesProps {
  onTextNoteAdded: (content: string) => void;
}

function Notes(props: NotesProps) {
  const [textNoteDialogOpen, setTextNoteDialogOpen] = React.useState(false);
  const [currentTextNoteContent, setCurrentTextNotContent] = React.useState("");

  function addNote() {
    props.onTextNoteAdded(currentTextNoteContent);
    setCurrentTextNotContent("");
    setTextNoteDialogOpen(false);
  }

  return (
    <>
      <Dialog
        open={textNoteDialogOpen}
        onClose={() => setTextNoteDialogOpen(false)}
      >
        <DialogTitle>Add text note</DialogTitle>
        <DialogContent>
          <TextField
            multiline
            value={currentTextNoteContent}
            onChange={(e) => setCurrentTextNotContent(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={addNote}>Add</Button>
        </DialogActions>
      </Dialog>

      <SpeedDial
        ariaLabel="Add"
        sx={{ position: "absolute", bottom: 16, right: 16 }}
        icon={<SpeedDialIcon />}
      >
        <SpeedDialAction
          icon={<SpeakerNotes />}
          tooltipTitle="Text note"
          onClick={() => setTextNoteDialogOpen(true)}
        />
        <SpeedDialAction icon={<CameraAlt />} tooltipTitle="Photo note" />
        <SpeedDialAction icon={<Mic />} tooltipTitle="Audio note" />
      </SpeedDial>
    </>
  );
}

export default Notes;
