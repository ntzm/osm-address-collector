export type Direction = 'L' | 'F' | 'R'

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
