import { Add, Delete } from "@mui/icons-material";
import {
  Container,
  IconButton,
  Box,
  List,
  ListItem,
  Grid,
  TextField,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import SubPageTopMenu from "../../SubPageTopMenu";
import {
  addTag,
  changeTagKey,
  changeTagValue,
  deleteTag,
  selectCustomTags,
} from "./slice";

function CustomTagsPage() {
  const tags = useAppSelector(selectCustomTags);
  const dispatch = useAppDispatch();

  return (
    <Container maxWidth="sm">
      <SubPageTopMenu header="Custom tags" />
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
                    onBlur={(e) =>
                      dispatch(changeTagKey({ id: i, newKey: e.target.value }))
                    }
                  />
                </Grid>
                <Grid item xs>
                  <TextField
                    label="Value"
                    size="small"
                    value={tag.value}
                    onBlur={(e) =>
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

export default CustomTagsPage;
