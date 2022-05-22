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
import { useAppDispatch, useAppSelector } from "./app/hooks";
import {
  addTag,
  changeTagKey,
  changeTagValue,
  deleteTag,
  selectCustomTags,
} from "./features/customTags/slice";

function CustomTags() {
  const tags = useAppSelector(selectCustomTags);
  const dispatch = useAppDispatch();

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
                    onChange={(e) =>
                      dispatch(changeTagKey({ id: i, newKey: e.target.value }))
                    }
                  />
                </Grid>
                <Grid item xs>
                  <TextField
                    label="Value"
                    size="small"
                    value={tag.value}
                    onChange={(e) =>
                      dispatch(
                        changeTagValue({ id: i, newValue: e.target.value })
                      )
                    }
                  />
                </Grid>
                <Grid item>
                  <IconButton onClick={() => dispatch(deleteTag({ id: i }))}>
                    <Delete />
                  </IconButton>
                </Grid>
              </Grid>
            </ListItem>
          ))}
        </List>
        <IconButton onClick={() => dispatch(addTag({ key: "", value: "" }))}>
          <Add />
        </IconButton>
      </Box>
    </Container>
  );
}

export default CustomTags;
