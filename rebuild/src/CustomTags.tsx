import { Add, ArrowBack, Delete } from "@mui/icons-material";
import {
  Container,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  List,
  ListItem,
  Grid,
  TextField,
} from "@mui/material";
import { Link } from "react-router-dom";
import { CustomTag } from "./types";

interface CustomTagsProps {
  tags: CustomTag[];
  onAdd: (customTag: CustomTag) => void;
  onChangeKey: (key: string, id: number) => void;
  onChangeValue: (value: string, id: number) => void;
  onDelete: (id: number) => void;
}

function CustomTags(props: CustomTagsProps) {
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
            Custom tags
          </Typography>
        </Toolbar>
      </AppBar>
      <Box mt={10}>
        <List>
          {props.tags.map((tag, i) => (
            <ListItem key={`custom-tag-${i}`}>
              <Grid container spacing={1}>
                <Grid item xs>
                  <TextField
                    label="Key"
                    size="small"
                    autoCapitalize="no"
                    value={tag.key}
                    onChange={(e) => props.onChangeKey(e.target.value, i)}
                  />
                </Grid>
                <Grid item xs>
                  <TextField
                    label="Value"
                    size="small"
                    value={tag.value}
                    onChange={(e) => props.onChangeValue(e.target.value, i)}
                  />
                </Grid>
                <Grid item>
                  <IconButton onClick={() => props.onDelete(i)}>
                    <Delete />
                  </IconButton>
                </Grid>
              </Grid>
            </ListItem>
          ))}
        </List>
        <IconButton onClick={() => props.onAdd({ key: "", value: "" })}>
          <Add />
        </IconButton>
      </Box>
    </Container>
  );
}

export default CustomTags;
