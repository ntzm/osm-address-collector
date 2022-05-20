import { Help } from "@mui/icons-material";
import { ListItemButton, ListItemIcon, ListItemText } from "@mui/material";

function HelpMenuButton() {
  return (
    <ListItemButton>
      <ListItemIcon>
        <Help />
      </ListItemIcon>
      <ListItemText primary="Help" />
    </ListItemButton>
  );
}

export default HelpMenuButton;
