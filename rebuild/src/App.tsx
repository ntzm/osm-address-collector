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
import { Position } from "./types";
import { HashRouter, Route, Routes } from "react-router-dom";
import SettingsPage from "./Settings";
import CustomTags from "./CustomTags";
import { useMemo } from "react";

function App() {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? "dark" : "light",
        },
      }),
    [prefersDarkMode]
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
  const notes: string[] = [];

  function addNote(content: string) {
    notes.push(content);

    console.log(notes);
  }

  function updatePosition(position: Position) {
    console.log(position);
  }

  return (
    <Container maxWidth="sm">
      <MenuBar />

      <Box mt={10}>
        <Keypad />
        <PositionAndOrientation onNewPosition={updatePosition} />
        <Notes onTextNoteAdded={addNote} />
      </Box>
    </Container>
  );
}

export default App;
