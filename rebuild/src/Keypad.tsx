import { BackspaceOutlined, Clear } from "@mui/icons-material";
import { Button, Grid, TextField } from "@mui/material";
import { useState } from "react";
import KeypadNumber from "./KeypadNumber";
import ThrowButton from "./ThrowButton";
import { useSelector } from "react-redux";
import { selectVibrate } from "./features/settings/slice";
import { useAppDispatch } from "./app/hooks";
import { Address } from "./features/addresses/types";
import { addAddress } from "./features/addresses/slice";
import { Direction } from "./features/addresses/enums";

function Keypad() {
  const [nameOrNumber, setNameOrNumber] = useState("");
  const shouldVibrate = useSelector(selectVibrate);
  const dispatch = useAppDispatch();

  function vibrate() {
    if (shouldVibrate) {
      navigator.vibrate(10);
    }
  }

  function throwAddress(direction: Direction) {
    const address: Address = {
      nameOrNumber: nameOrNumber,
      direction,
    };

    dispatch(addAddress(address));
    setNameOrNumber("");
  }

  function appendNumber(n: number) {
    vibrate();
    setNameOrNumber(nameOrNumber + String(n));
  }

  function clear() {
    vibrate();
    setNameOrNumber("");
  }

  function backspace() {
    vibrate();
    setNameOrNumber(nameOrNumber.slice(0, -1));
  }

  return (
    <Grid container spacing={1}>
      <Grid item xs>
        <TextField
          fullWidth={true}
          label="House name or number"
          autoCapitalize="words"
          value={nameOrNumber}
          onChange={(e) => setNameOrNumber(e.target.value)}
        />
      </Grid>
      <Grid container item spacing={1}>
        <Grid item xs>
          <ThrowButton direction={Direction.Left} onClick={throwAddress} />
        </Grid>
        <Grid item xs>
          <ThrowButton direction={Direction.Forward} onClick={throwAddress} />
        </Grid>
        <Grid item xs>
          <ThrowButton direction={Direction.Right} onClick={throwAddress} />
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
