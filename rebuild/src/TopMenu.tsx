import { Menu } from "@mui/icons-material";
import { AppBar, Toolbar, IconButton, Typography } from "@mui/material";

interface TopMenuProps {
  onSideMenuOpen: () => void;
}

function TopMenu(props: TopMenuProps) {
  return (
    <AppBar>
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          sx={{ mr: 2 }}
          onClick={props.onSideMenuOpen}
        >
          <Menu />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          OSM Address Collector
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export default TopMenu;
