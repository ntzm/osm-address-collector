export interface Position {
  readonly latitutde: number;
  readonly longitude: number;
}

export interface StoredPosition extends Position {
  readonly timestamp: number;
}
