import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { HashRouter, Route, Routes } from "react-router-dom";
import CustomTagsPage from "./features/customTags/CustomTagsPage";
import { useMemo } from "react";
import SettingsPage from "./features/settings/SettingsPage";
import { useSelector } from "react-redux";
import { selectDarkMode } from "./features/settings/slice";
import Main from "./Main";
import HelpPage from "./HelpPage";

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
          <Route path="/custom-tags" element={<CustomTagsPage />} />
          <Route path="/help" element={<HelpPage />} />
        </Routes>
      </HashRouter>
    </ThemeProvider>
  );
}

export default App;
