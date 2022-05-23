import { Pause, PlayArrow } from "@mui/icons-material";
import { ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { useSelector } from "react-redux";
import { useAppDispatch } from "./app/hooks";
import { SurveyStatus } from "./features/surveyStatus/enums";
import { selectSurveyStatus, togglePause } from "./features/surveyStatus/slice";

function StartOrPauseMenuButton() {
  const surveyStatus = useSelector(selectSurveyStatus);
  const dispatch = useAppDispatch();

  return (
    <ListItemButton onClick={() => dispatch(togglePause())}>
      <ListItemIcon>
        {surveyStatus === SurveyStatus.Started ? <Pause /> : <PlayArrow />}
      </ListItemIcon>
      <ListItemText
        primary={surveyStatus === SurveyStatus.Started ? "Pause" : "Start"}
      />
    </ListItemButton>
  );
}

export default StartOrPauseMenuButton;
