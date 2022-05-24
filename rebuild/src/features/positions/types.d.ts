export interface Position {
  readonly latitutde: number;
  readonly longitude: number;
}

export interface TimedPosition extends Position {
  readonly timestamp: number;
}
