import { PlayArrow } from "@mui/icons-material";
import { ListItemButton, ListItemIcon, ListItemText } from "@mui/material";

function StartOrPauseMenuButton() {
  return (
    <ListItemButton>
      <ListItemIcon>
        <PlayArrow />
      </ListItemIcon>
      <ListItemText primary="Start" />
    </ListItemButton>
  );
}

export default StartOrPauseMenuButton;
