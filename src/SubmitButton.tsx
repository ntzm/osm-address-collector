import IconButton from "./IconButton";
import { Direction } from "./types";

export default function SubmitButton(props: {
  className?: string,
  onClick: (direction: Direction) => void,
  direction: Direction,
}) {
  const rotate = {
    'L': -90,
    'F': 0,
    'R': 90,
  }

  return <IconButton
    className={props.className}
    rotate={rotate[props.direction]}
    onClick={() => props.onClick(props.direction)}
    src="icons/arrow_upward_black_24dp.svg"
  />
}