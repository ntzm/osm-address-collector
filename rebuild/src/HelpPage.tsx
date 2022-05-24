import {
  Container,
  Box,
  List,
  ListSubheader,
  ListItem,
  ListItemText,
} from "@mui/material";
import SubPageTopMenu from "./SubPageTopMenu";

function HelpPage() {
  return (
    <Container maxWidth="sm">
      <SubPageTopMenu header="Help" />
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
