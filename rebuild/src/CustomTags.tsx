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
import { useState } from "react";
import { Link } from "react-router-dom";
import { CustomTag } from "./types";

function CustomTags() {
  const [tags, setTags] = useState<CustomTag[]>([]);

  function addEmptyTag() {
    setTags(tags.concat({ key: "", value: "" }));
  }

  function deleteTag(id: number) {
    setTags(tags.filter((_, i) => i !== id));
  }

  function updateKey(key: string, id: number) {
    const newTags = [...tags];
    newTags[id].key = key;
    setTags(newTags);

    // todo: warn on duplicate key
  }

  function updateValue(value: string, id: number) {
    const newTags = [...tags];
    newTags[id].value = value;
    setTags(newTags);
  }

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
          {tags.map((tag, i) => (
            <ListItem key={`custom-tag-${i}`}>
              <Grid container spacing={1}>
                <Grid item xs>
                  <TextField
                    label="Key"
                    size="small"
                    autoCapitalize="no"
                    value={tag.key}
                    onChange={(e) => updateKey(e.target.value, i)}
                  />
                </Grid>
                <Grid item xs>
                  <TextField
                    label="Value"
                    size="small"
                    value={tag.value}
                    onChange={(e) => updateValue(e.target.value, i)}
                  />
                </Grid>
                <Grid item>
                  <IconButton onClick={() => deleteTag(i)}>
                    <Delete />
                  </IconButton>
                </Grid>
              </Grid>
            </ListItem>
          ))}
        </List>
        <IconButton onClick={addEmptyTag}>
          <Add />
        </IconButton>
      </Box>
    </Container>
  );
}

export default CustomTags;
