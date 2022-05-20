import { BackspaceOutlined, Clear } from "@mui/icons-material";
import { Button, Grid, TextField } from "@mui/material";
import { useContext, useState } from "react";
import KeypadNumber from "./KeypadNumber";
import ThrowButton from "./ThrowButton";
import { Direction } from "./enums";
import SettingsContext from "./SettingsContext";

function Keypad() {
  const [numberOrName, setNumberOrName] = useState("");
  const settings = useContext(SettingsContext);

  function vibrate() {
    if (settings.vibrate) {
      navigator.vibrate(10);
    }
  }

  function appendNumber(n: number) {
    vibrate();
    setNumberOrName(numberOrName + String(n));
  }

  function clear() {
    vibrate();
    setNumberOrName("");
  }

  function backspace() {
    vibrate();
    setNumberOrName(numberOrName.slice(0, -1));
  }

  return (
    <Grid container spacing={1}>
      <Grid item xs>
        <TextField
          fullWidth={true}
          label="House number or name"
          autoCapitalize="words"
          value={numberOrName}
          onChange={(e) => setNumberOrName(e.target.value)}
        />
      </Grid>
      <Grid container item spacing={1}>
        <Grid item xs>
          <ThrowButton direction={Direction.Left} />
        </Grid>
        <Grid item xs>
          <ThrowButton direction={Direction.Forward} />
        </Grid>
        <Grid item xs>
          <ThrowButton direction={Direction.Right} />
        </Grid>
      </Grid>
      <Grid container item spacing={1}>
        <Grid item xs>
          <KeypadNumber num={1} onClick={appendNumber} />
        </Grid>
        <Grid item xs>
          <KeypadNumber num={2} onClick={appendNumber} />
        </Grid>
        <Grid item xs>
          <KeypadNumber num={3} onClick={appendNumber} />
        </Grid>
      </Grid>
      <Grid container item spacing={1}>
        <Grid item xs>
          <KeypadNumber num={4} onClick={appendNumber} />
        </Grid>
        <Grid item xs>
          <KeypadNumber num={5} onClick={appendNumber} />
        </Grid>
        <Grid item xs>
          <KeypadNumber num={6} onClick={appendNumber} />
        </Grid>
      </Grid>
      <Grid container item spacing={1}>
        <Grid item xs>
          <KeypadNumber num={7} onClick={appendNumber} />
        </Grid>
        <Grid item xs>
          <KeypadNumber num={8} onClick={appendNumber} />
        </Grid>
        <Grid item xs>
          <KeypadNumber num={9} onClick={appendNumber} />
        </Grid>
      </Grid>
      <Grid container item spacing={1}>
        <Grid item xs>
          <Button
            variant="text"
            fullWidth={true}
            sx={{ height: 80, fontSize: "2rem", color: "text.secondary" }}
            onClick={clear}
          >
            <Clear fontSize="inherit" />
          </Button>
        </Grid>
        <Grid item xs>
          <KeypadNumber num={0} onClick={appendNumber} />
        </Grid>
        <Grid item xs>
          <Button
            variant="text"
            fullWidth={true}
            sx={{ height: 80, fontSize: "2rem", color: "text.secondary" }}
            onClick={backspace}
          >
            <BackspaceOutlined fontSize="inherit" />
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default Keypad;
