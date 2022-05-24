import { Direction } from "../../enums";
import { Position } from "../positions/types";

export interface Address {
  readonly nameOrNumber: string;
  readonly direction: Direction;
}

export interface TimedAddress extends Address {
  readonly timestamp: number;
}
