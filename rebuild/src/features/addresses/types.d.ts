import { Direction } from "../../enums";
import { Position } from "../../types";

export interface Address {
  nameOrNumber: string;
  direction: Direction;
  position: Position;
}
