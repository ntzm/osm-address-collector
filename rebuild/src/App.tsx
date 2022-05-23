import {
  Backdrop,
  Box,
  Button,
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
import {
  selectSurveyStatus,
  attemptStart,
  start,
  failedToStart,
} from "./features/surveyStatus/slice";
import { SurveyStatus } from "./features/surveyStatus/enums";
import PositionAndOrientation from "./PositionAndOrientation";
import { useAppDispatch } from "./app/hooks";

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
  const surveyStatus = useSelector(selectSurveyStatus);

  const gpsNotAcquired = [
    SurveyStatus.NotStarted,
    SurveyStatus.Starting,
    SurveyStatus.FailedToStart,
  ].includes(surveyStatus);

  const dispatch = useAppDispatch();

  async function tryToStart() {
    dispatch(attemptStart());

    const currentPermission = await navigator.permissions.query({
      name: "geolocation",
    });

    if (currentPermission.state === "granted") {
      dispatch(start());
      return;
    }

    if (currentPermission.state === "denied") {
      console.log("DENIED!!!");
      dispatch(failedToStart());
      return;
    }

    // todo it asks for twice on firefox desktop
    navigator.geolocation.getCurrentPosition(
      () => {
        dispatch(start());
      },
      (e) => {
        console.log(e);
        dispatch(failedToStart());
      }
    );
  }

  return (
    <>
      <Backdrop sx={{ zIndex: 1201 }} open={gpsNotAcquired}>
        <Button
          variant="contained"
          size="large"
          disabled={surveyStatus === SurveyStatus.Starting}
          onClick={tryToStart}
        >
          {surveyStatus === SurveyStatus.NotStarted && "Start"}
          {surveyStatus === SurveyStatus.Starting && "Starting..."}
          {surveyStatus === SurveyStatus.FailedToStart && "Failed to start"}
        </Button>
      </Backdrop>
      {surveyStatus === SurveyStatus.Started && <PositionAndOrientation />}
      <Container maxWidth="sm">
        <Menu />

        <Box mt={10}>
          <Keypad />
          <Notes />
        </Box>
      </Container>
    </>
  );
}

export default App;
