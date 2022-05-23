import { Backdrop, Button, Container, Box } from "@mui/material";
import { useSelector } from "react-redux";
import { useAppDispatch } from "./app/hooks";
import { SurveyStatus } from "./features/surveyStatus/enums";
import {
  selectSurveyStatus,
  start,
  failedToStart,
  attemptStart as attemptStartAction,
} from "./features/surveyStatus/slice";
import Keypad from "./Keypad";
import PositionAndOrientation from "./PositionAndOrientation";
import Menu from "./Menu";
import Notes from "./Notes";

function Main() {
  const surveyStatus = useSelector(selectSurveyStatus);

  const gpsNotAcquired = [
    SurveyStatus.NotStarted,
    SurveyStatus.Starting,
    SurveyStatus.FailedToStart,
  ].includes(surveyStatus);

  const dispatch = useAppDispatch();

  async function attemptStart() {
    dispatch(attemptStartAction());

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
          onClick={attemptStart}
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

export default Main;
