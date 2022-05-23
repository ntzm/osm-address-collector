import { Button } from "@mui/material";
import { memo } from "react";

interface KeypadNumberProps {
  onClick: (num: number) => void;
  num: number;
}

function KeypadNumber(props: KeypadNumberProps) {
  return (
    <Button
      variant="text"
      fullWidth={true}
      sx={{ height: 80, fontSize: "2rem" }}
      onClick={() => props.onClick(props.num)}
    >
      {props.num}
    </Button>
  );
}

export default memo(KeypadNumber);
