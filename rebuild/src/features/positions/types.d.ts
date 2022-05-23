export interface Position {
  latitutde: number;
  longitude: number;
}

export interface TimedPosition extends Position {
  timestamp: number;
}
