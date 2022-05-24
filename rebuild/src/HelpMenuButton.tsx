import { Help } from "@mui/icons-material";
import { ListItemIcon } from "@mui/material";
import ListItemLink from "./ListItemLink";

function HelpMenuButton() {
  return (
    <ListItemLink
      to="/help"
      primary="Help"
      icon={
        <ListItemIcon>
          <Help />
        </ListItemIcon>
      }
    />
  );
}

export default HelpMenuButton;
