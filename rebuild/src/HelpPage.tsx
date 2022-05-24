import { ArrowBack } from "@mui/icons-material";
import {
  Container,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  List,
  ListSubheader,
  ListItem,
  ListItemText,
} from "@mui/material";
import { Link } from "react-router-dom";

function HelpPage() {
  return (
    <Container maxWidth="sm">
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
            Help
          </Typography>
        </Toolbar>
      </AppBar>
      <Box mt={10}>
        <List subheader={<ListSubheader>Information</ListSubheader>}>
          <ListItem>
            <ListItemText primary="Version" secondary="alpha" />
          </ListItem>
        </List>
      </Box>
    </Container>
  );
}

export default HelpPage;
