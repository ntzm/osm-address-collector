import { LocalOffer } from "@mui/icons-material";
import { ListItemIcon, Badge } from "@mui/material";
import { memo } from "react";
import { useSelector } from "react-redux";
import { selectCustomTags } from "./features/customTags/slice";
import ListItemLink from "./ListItemLink";

function CustomTagsMenuButton() {
  const customTags = useSelector(selectCustomTags);

  return (
    <ListItemLink
      to="/custom-tags"
      primary="Custom tags"
      icon={
        <ListItemIcon>
          <Badge badgeContent={customTags.length} color="primary">
            <LocalOffer />
          </Badge>
        </ListItemIcon>
      }
    />
  );
}

export default memo(CustomTagsMenuButton);
