import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
} from "@mui/material";
import { memo, useState } from "react";
import { useAppDispatch } from "../../app/hooks";
import { addTextNote } from "./slice";

interface TextNoteDialogProps {
  open: boolean;
  onClose: () => void;
}

function TextNoteDialog(props: TextNoteDialogProps) {
  const [content, setContent] = useState("");
  const dispatch = useAppDispatch();

  function add() {
    dispatch(addTextNote(content));

    setContent("");
    props.onClose();
  }

  function close() {
    setContent("");
    props.onClose();
  }

  return (
    <Dialog disableRestoreFocus open={props.open} onClose={close}>
      <DialogTitle>Add text note</DialogTitle>
      <DialogContent>
        <TextField
          multiline
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={add}>Add</Button>
      </DialogActions>
    </Dialog>
  );
}

export default memo(TextNoteDialog);
