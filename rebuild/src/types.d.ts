import { EventType, Direction } from "./enums";

export interface Position {
  latitutde: number;
  longitude: number;
}

export interface TimedPosition extends Position {
  time: Date;
}

export interface ContextSettings extends Settings {
  setSettings: (settings: Settings) => void;
}

export interface EventRecord {
  time: Date;
  position: Position;
  event: Event;
}

interface BaseEvent {
  type: EventType;
}

export interface AddAddress extends BaseEvent {
  type: EventType.AddAddress;
  houseNameOrNumber: string;
  direction: Direction;
}

export interface AddTextNote extends BaseEvent {
  type: EventType.AddTextNote;
  content: string;
}

export interface NewPosition extends BaseEvent {
  type: EventType.NewPosition;
  position: Position;
}

export type Event = AddAddress | AddTextNote | NewPosition;
