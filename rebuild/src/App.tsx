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
import { HashRouter, Route, Routes } from "react-router-dom";
import CustomTags from "./features/customTags/CustomTags";
import { useMemo } from "react";
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
  return (
    <Container maxWidth="sm">
      <Menu />

      <Box mt={10}>
        <Keypad />
        <Notes />
      </Box>
    </Container>
  );
}

export default App;
