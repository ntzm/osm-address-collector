import { Position } from "../positions/types";

export interface TextNote {
  readonly content: string;
  readonly position: Position;
}

export interface TimedTextNote extends TextNote {
  readonly timestamp: number;
}
