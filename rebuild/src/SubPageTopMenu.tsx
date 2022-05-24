import { ArrowBack } from "@mui/icons-material";
import { AppBar, Toolbar, IconButton, Typography } from "@mui/material";
import { Link } from "react-router-dom";

interface SubPageTopMenuProps {
  header: string;
}

function SubPageTopMenu(props: SubPageTopMenuProps) {
  return (
    <AppBar color="default">
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          component={Link}
          to="/"
          sx={{ mr: 2 }}
        >
          <ArrowBack />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {props.header}
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export default SubPageTopMenu;
