import "./App.css";
import {
  Box,
  Container,
  createTheme,
  CssBaseline,
  ThemeProvider,
  useMediaQuery,
} from "@mui/material";
import Keypad from "./Keypad";
import MenuBar from "./MenuBar";
import Notes from "./Notes";
import PositionAndOrientation from "./LocationAndOrientation";
import { EventRecord, Position, Settings, Event } from "./types";
import { HashRouter, Route, Routes } from "react-router-dom";
import SettingsPage from "./Settings";
import CustomTags from "./CustomTags";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import SettingsContext from "./SettingsContext";
import { EventType } from "./enums";

function useStickyState<T>(
  defaultValue: T,
  key: string
): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState(() => {
    const stickyValue = window.localStorage.getItem(key);
    return stickyValue !== null ? JSON.parse(stickyValue) : defaultValue;
  });

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

function App() {
  const [settings, setSettings] = useStickyState<Settings>(
    {
      throwDistance: 10,
      vibrate: true,
      recordTrace: true,
      darkMode: useMediaQuery("(prefers-color-scheme: dark)"),
    },
    "settings"
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: settings.darkMode ? "dark" : "light",
        },
      }),
    [settings.darkMode]
  );

  return (
    <SettingsContext.Provider value={{ setSettings, ...settings }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <HashRouter>
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/custom-tags" element={<CustomTags />} />
          </Routes>
        </HashRouter>
      </ThemeProvider>
    </SettingsContext.Provider>
  );
}

function Main() {
  const actions: EventRecord[] = [];

  const [latestPosition, setLatestPosition] = useState<Position>({
    latitutde: 0,
    longitude: 0,
  });

  function handleEvent(action: Event) {
    if (action.type === EventType.NewPosition) {
      setLatestPosition(action.position);
    }

    const record: EventRecord = {
      time: new Date(),
      position: latestPosition,
      event: action,
    };

    console.log(record);

    actions.push(record);
  }

  function updatePosition(position: Position) {
    console.log(position);
  }

  return (
    <Container maxWidth="sm">
      <MenuBar />

      <Box mt={10}>
        <Keypad onEvent={handleEvent} />
        <PositionAndOrientation onNewPosition={updatePosition} />
        <Notes onEvent={handleEvent} />
      </Box>
    </Container>
  );
}

export default App;
