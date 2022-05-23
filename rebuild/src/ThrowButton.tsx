import { ArrowBack, ArrowForward, ArrowUpward } from "@mui/icons-material";
import { Button } from "@mui/material";
import { memo } from "react";
import { Direction } from "./features/addresses/enums";

interface ThrowButtonProps {
  direction: Direction;
  onClick: (direction: Direction) => void;
}

const directionIconMap = {
  [Direction.Left]: <ArrowBack fontSize="inherit" />,
  [Direction.Forward]: <ArrowUpward fontSize="inherit" />,
  [Direction.Right]: <ArrowForward fontSize="inherit" />,
};

function ThrowButton(props: ThrowButtonProps) {
  return (
    <Button
      variant="text"
      fullWidth={true}
      sx={{ height: 80, fontSize: "2rem", color: "text.secondary" }}
      onClick={() => props.onClick(props.direction)}
    >
      {directionIconMap[props.direction]}
    </Button>
  );
}

export default memo(ThrowButton);
