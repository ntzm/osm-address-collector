import {
  ArrowBack,
  DarkMode,
  Straighten,
  Timeline,
  Vibration,
} from "@mui/icons-material";
import {
  AppBar,
  Box,
  Container,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Slider,
  Stack,
  Switch,
  Toolbar,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Settings } from "./types";

function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    throwDistance: 10,
    vibrate: true,
    recordTrace: true,
    darkMode: false,
  });

  function updateThrowDistance(newThrowDistance: number) {
    setSettings({
      ...settings,
      throwDistance: newThrowDistance,
    });
  }

  function toggleVibrate() {
    if (!settings.vibrate) {
      navigator.vibrate(10);
    }

    setSettings({
      ...settings,
      vibrate: !settings.vibrate,
    });
  }

  function toggleRecordTrace() {
    setSettings({
      ...settings,
      recordTrace: !settings.recordTrace,
    });
  }

  function toggleDarkMode() {
    setSettings({
      ...settings,
      darkMode: !settings.darkMode,
    });
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
            Settings
          </Typography>
        </Toolbar>
      </AppBar>
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
                value={settings.throwDistance}
                onChange={(_, value) => updateThrowDistance(value as number)}
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
              checked={settings.recordTrace}
              onChange={toggleRecordTrace}
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
              checked={settings.vibrate}
              onChange={toggleVibrate}
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <DarkMode />
            </ListItemIcon>
            <ListItemText primary="Dark mode" />
            <Switch
              edge="end"
              checked={settings.darkMode}
              onChange={toggleDarkMode}
            />
          </ListItem>
        </List>
      </Box>
    </Container>
  );
}

export default SettingsPage;
