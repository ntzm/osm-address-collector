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
