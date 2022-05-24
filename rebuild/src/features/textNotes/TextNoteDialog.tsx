import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
} from "@mui/material";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../app/hooks";
import { selectLatestPositionId } from "../positions/slice";
import { addTextNote } from "./slice";

interface TextNoteDialogProps {
  open: boolean;
  onClose: () => void;
}

function TextNoteDialog(props: TextNoteDialogProps) {
  const [content, setContent] = useState("");
  const latestPositionId = useSelector(selectLatestPositionId);
  const dispatch = useAppDispatch();

  function add() {
    dispatch(addTextNote({ content, positionId: latestPositionId }));

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

export default TextNoteDialog;
