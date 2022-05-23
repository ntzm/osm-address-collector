import { Direction } from "../../enums";
import { Position } from "../positions/types";

export interface Address {
  nameOrNumber: string;
  direction: Direction;
}

export interface TimedAddress extends Address {
  timestamp: number;
}
