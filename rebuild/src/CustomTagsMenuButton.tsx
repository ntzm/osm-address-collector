import { LocalOffer } from "@mui/icons-material";
import { ListItemIcon, Badge } from "@mui/material";
import { memo } from "react";
import ListItemLink from "./ListItemLink";

interface CustomTagsMenuButtonProps {
  customTagCount: number;
}

function CustomTagsMenuButton(props: CustomTagsMenuButtonProps) {
  return (
    <ListItemLink
      to="/custom-tags"
      primary="Custom tags"
      icon={
        <ListItemIcon>
          <Badge badgeContent={props.customTagCount} color="primary">
            <LocalOffer />
          </Badge>
        </ListItemIcon>
      }
    />
  );
}

export default memo(CustomTagsMenuButton);
