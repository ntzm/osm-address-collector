import { EventType, Direction } from "./enums";

export interface Position {
  latitutde: number;
  longitude: number;
}

export interface TimedPosition extends Position {
  time: Date;
}
