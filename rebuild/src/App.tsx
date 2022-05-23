import "./App.css";
import {
  Box,
  Container,
  createTheme,
  CssBaseline,
  ThemeProvider,
} from "@mui/material";
import Keypad from "./Keypad";
import Menu from "./Menu";
import Notes from "./Notes";
import { EventRecord, Position, Event } from "./types";
import { HashRouter, Route, Routes } from "react-router-dom";
import CustomTags from "./features/customTags/CustomTags";
import { useMemo, useState } from "react";
import { EventType } from "./enums";
import SettingsPage from "./features/settings/SettingsPage";
import { useSelector } from "react-redux";
import { selectDarkMode } from "./features/settings/slice";

function App() {
  const darkMode = useSelector(selectDarkMode);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? "dark" : "light",
        },
      }),
    [darkMode]
  );

  return (
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

  return (
    <Container maxWidth="sm">
      <Menu />

      <Box mt={10}>
        <Keypad onEvent={handleEvent} />
        <Notes onEvent={handleEvent} />
      </Box>
    </Container>
  );
}

export default App;
