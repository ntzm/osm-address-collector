import { Download } from "@mui/icons-material";
import { ListItemButton, ListItemIcon, ListItemText } from "@mui/material";

function CompleteMenuButton() {
  return (
    <ListItemButton>
      <ListItemIcon>
        <Download />
      </ListItemIcon>
      <ListItemText primary="Complete" />
    </ListItemButton>
  );
}

export default CompleteMenuButton;
