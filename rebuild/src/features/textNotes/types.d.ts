import { Position } from "../positions/types";

export interface TextNote {
  content: string;
  position: Position;
}

export interface TimedTextNote extends TextNote {
  timestamp: number;
}
