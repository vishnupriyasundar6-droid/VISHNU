
export interface Position {
  x: number;
  y: number;
}

export interface GameState {
  playerPosition: number;
  isMoving: boolean;
  lastDiceRoll: number;
  status: 'playing' | 'won' | 'lost';
  history: string[];
  narratorMessage: string;
}

export type PortalType = 'snake' | 'ladder';

export interface Portal {
  start: number;
  end: number;
  type: PortalType;
}
