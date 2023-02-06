export type Direction = 'L' | 'F' | 'R'
export type SurveyState = 'not started' | 'starting' | 'started' | 'paused' | 'finishing' | 'finished' | 'error'

export type Address = {
  latitude: number;
  longitude: number;
  numberOrName: string;
  skippedNumbers: number[];
  street: string | undefined;
  customTags: CustomTag[];
  direction: Direction;
}

export type Note = {
  latitude: number;
  longitude: number;
  content: string;
}

export type Position = {
  latitude: number;
  longitude: number;
}

export type CustomTag = {
  key: string;
  value: string;
}

export interface DeviceOrientationEventiOS extends DeviceOrientationEvent {
  requestPermission: () => Promise<'granted' | 'denied'>;
}

export interface WebkitDeviceOrientationEvent extends DeviceOrientationEvent {
  readonly webkitCompassHeading: number
}
