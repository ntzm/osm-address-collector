import { ActionType, Direction } from "./enums";

export interface Position {
  latitutde: number;
  longitude: number;
}

export interface TimedPosition extends Position {
  time: Date;
}

export interface CustomTag {
  key: string;
  value: string;
}

export interface Settings {
  throwDistance: number;
  vibrate: boolean;
  recordTrace: boolean;
  darkMode: boolean;
}

export interface ContextSettings extends Settings {
  setSettings: (settings: Settings) => void;
}

export interface ActionRecord {
  time: Date;
  position: Position;
  action: Action;
}

interface BaseAction {
  type: ActionType;
}

export interface AddAddress extends BaseAction {
  type: ActionType.AddAddress;
  houseNameOrNumber: string;
  direction: Direction;
}

export interface AddTextNote extends BaseAction {
  type: ActionType.AddTextNote;
  content: string;
}

export interface NewPosition extends BaseAction {
  type: ActionType.NewPosition;
  position: Position;
}

export type Action = AddAddress | AddTextNote | NewPosition;
