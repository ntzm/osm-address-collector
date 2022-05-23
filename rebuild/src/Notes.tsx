import { SpeakerNotes, CameraAlt, Mic } from "@mui/icons-material";
import { SpeedDial, SpeedDialIcon, SpeedDialAction } from "@mui/material";
import { useState } from "react";
import TextNoteDialog from "./features/textNotes/TextNoteDialog";

function Notes() {
  const [textNoteDialogOpen, setTextNoteDialogOpen] = useState(false);

  return (
    <>
      <TextNoteDialog
        open={textNoteDialogOpen}
        onClose={() => setTextNoteDialogOpen(false)}
      />

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
