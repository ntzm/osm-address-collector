import { DarkMode, Straighten, Timeline, Vibration } from "@mui/icons-material";
import {
  Box,
  Container,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Slider,
  Stack,
  Switch,
  Typography,
} from "@mui/material";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../app/hooks";
import SubPageTopMenu from "../../SubPageTopMenu";
import {
  changeThrowDistance,
  selectDarkMode,
  selectRecordTrace,
  selectThrowDistance,
  selectVibrate,
  toggleDarkMode,
  toggleRecordTrace,
  toggleVibrate,
} from "./slice";

function SettingsPage() {
  const dispatch = useAppDispatch();

  const throwDistance = useSelector(selectThrowDistance);
  const vibrate = useSelector(selectVibrate);
  const recordTrace = useSelector(selectRecordTrace);
  const darkMode = useSelector(selectDarkMode);

  return (
    <Container maxWidth="sm">
      <SubPageTopMenu header="Settings" />
      <Box mt={10}>
        <List subheader={<ListSubheader>Recording</ListSubheader>}>
          <ListItem>
            <ListItemIcon>
              <Straighten />
            </ListItemIcon>
            <Stack width="100%" spacing={0}>
              <Typography>Throw distance</Typography>
              <Slider
                size="small"
                min={1}
                max={30}
                valueLabelDisplay="auto"
                valueLabelFormat={(v) => `${v}m`}
                value={throwDistance}
                onChange={(_, value) =>
                  dispatch(changeThrowDistance(value as number))
                }
              ></Slider>
            </Stack>
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <Timeline />
            </ListItemIcon>
            <ListItemText
              primary="Record trace"
              secondary="Record and save location as a .gpx file"
            />
            <Switch
              edge="end"
              checked={recordTrace}
              onChange={() => dispatch(toggleRecordTrace())}
            />
          </ListItem>
        </List>
        <Divider light />
        <List subheader={<ListSubheader>UI</ListSubheader>}>
          <ListItem>
            <ListItemIcon>
              <Vibration />
            </ListItemIcon>
            <ListItemText primary="Vibration" />
            <Switch
              edge="end"
              checked={vibrate}
              onChange={() => dispatch(toggleVibrate())}
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <DarkMode />
            </ListItemIcon>
            <ListItemText primary="Dark mode" />
            <Switch
              edge="end"
              checked={darkMode}
              onChange={() => dispatch(toggleDarkMode())}
            />
          </ListItem>
        </List>
      </Box>
    </Container>
  );
}

export default SettingsPage;
