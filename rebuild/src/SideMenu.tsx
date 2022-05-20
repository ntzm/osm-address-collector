import { Drawer, List, Divider } from "@mui/material";
import CompleteMenuButton from "./CompleteMenuButton";
import CustomTagsMenuButton from "./CustomTagsMenuButton";
import HelpMenuButton from "./HelpMenuButton";
import SettingsMenuButton from "./SettingsMenuButton";
import StartOrPauseMenuButton from "./StartOrPauseMenuButton";

interface SideMenuProps {
  isOpen: boolean;
  customTagCount: number;
  onClose: () => void;
}

function SideMenu(props: SideMenuProps) {
  return (
    <Drawer
      PaperProps={{ sx: { minWidth: "75%" } }}
      open={props.isOpen}
      onClose={props.onClose}
    >
      <List>
        <StartOrPauseMenuButton />
        <CompleteMenuButton />
      </List>
      <Divider light />
      <List>
        <CustomTagsMenuButton customTagCount={props.customTagCount} />
        <SettingsMenuButton />
        <HelpMenuButton />
      </List>
    </Drawer>
  );
}

export default SideMenu;
