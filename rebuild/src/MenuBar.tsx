import {
  Download,
  Help,
  LocalOffer,
  Menu,
  PlayArrow,
  Settings,
} from "@mui/icons-material";
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
  Divider,
} from "@mui/material";
import React from "react";
import { useState } from "react";
import {
  Link as RouterLink,
  LinkProps as RouterLinkProps,
} from "react-router-dom";

interface ListItemLinkProps {
  icon?: React.ReactElement;
  primary: string;
  to: string;
}

// copied from docs - seems like a bad hack
function ListItemLink(props: ListItemLinkProps) {
  const { icon, primary, to } = props;

  const renderLink = React.useMemo(
    () =>
      React.forwardRef<HTMLAnchorElement, Omit<RouterLinkProps, "to">>(
        function Link(itemProps, ref) {
          return (
            <RouterLink to={to} ref={ref} {...itemProps} role={undefined} />
          );
        }
      ),
    [to]
  );

  return (
    <li>
      <ListItem button component={renderLink}>
        {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
        <ListItemText primary={primary} />
      </ListItem>
    </li>
  );
}

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
      <Drawer
        PaperProps={{ sx: { minWidth: "75%" } }}
        open={isDrawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <List>
          <ListItemButton>
            <ListItemIcon>
              <PlayArrow />
            </ListItemIcon>
            <ListItemText primary="Start" />
          </ListItemButton>
          <ListItemButton>
            <ListItemIcon>
              <Download />
            </ListItemIcon>
            <ListItemText primary="Complete" />
          </ListItemButton>
        </List>
        <Divider light />
        <List>
          <ListItemLink
            to="/custom-tags"
            primary="Custom tags"
            icon={
              <ListItemIcon>
                <Badge badgeContent="0" color="primary">
                  <LocalOffer />
                </Badge>
              </ListItemIcon>
            }
          />
          <ListItemLink
            to="/settings"
            primary="Settings"
            icon={
              <ListItemIcon>
                <Settings />
              </ListItemIcon>
            }
          />
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
