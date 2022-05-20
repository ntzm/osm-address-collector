import { Settings } from "@mui/icons-material";
import { ListItemIcon } from "@mui/material";
import ListItemLink from "./ListItemLink";

function SettingsMenuButton() {
  return (
    <ListItemLink
      to="/settings"
      primary="Settings"
      icon={
        <ListItemIcon>
          <Settings />
        </ListItemIcon>
      }
    />
  );
}

export default SettingsMenuButton;
