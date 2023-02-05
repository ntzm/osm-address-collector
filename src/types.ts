export type Address = {
  latitude: number;
  longitude: number;
  numberOrName: string;
  skippedNumbers: number[];
  street: string | undefined;
  customTags: Record<string, string>;
  direction: 'L' | 'F' | 'R';
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