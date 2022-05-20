import { Help, LocalOffer, Menu, Settings } from "@mui/icons-material";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Badge,
  ListItem,
} from "@mui/material";
import { useState } from "react";
import { Link } from "react-router-dom";

function MenuBar() {
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <AppBar>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            sx={{ mr: 2 }}
            onClick={() => setDrawerOpen(true)}
          >
            <Menu />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            OSM Address Collector
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer open={isDrawerOpen} onClose={() => setDrawerOpen(false)}>
        <List>
          <ListItem component={Link} to="/custom-tags">
            <ListItemIcon>
              <Badge badgeContent="0" color="primary">
                <LocalOffer />
              </Badge>
            </ListItemIcon>
            <ListItemText primary="Custom tags" />
          </ListItem>
          <ListItem component={Link} to="/settings">
            <ListItemIcon>
              <Settings />
            </ListItemIcon>
            <ListItemText primary="Settings" />
          </ListItem>
          <ListItemButton>
            <ListItemIcon>
              <Help />
            </ListItemIcon>
            <ListItemText primary="Help" />
          </ListItemButton>
        </List>
      </Drawer>
    </>
  );
}

export default MenuBar;
