
import { Portal } from './types';

export const GRID_SIZE = 10;
export const TOTAL_SQUARES = GRID_SIZE * GRID_SIZE;

export const PORTALS: Record<number, Portal> = {
  // Ladders (Progress)
  1: { start: 1, end: 38, type: 'ladder' },
  4: { start: 4, end: 14, type: 'ladder' },
  9: { start: 9, end: 31, type: 'ladder' },
  21: { start: 21, end: 42, type: 'ladder' },
  28: { start: 28, end: 84, type: 'ladder' },
  36: { start: 36, end: 44, type: 'ladder' },
  51: { start: 51, end: 67, type: 'ladder' },
  71: { start: 71, end: 91, type: 'ladder' },
  80: { start: 80, end: 100, type: 'ladder' },

  // Snakes (Setbacks)
  16: { start: 16, end: 6, type: 'snake' },
  47: { start: 47, end: 26, type: 'snake' },
  49: { start: 49, end: 11, type: 'snake' },
  56: { start: 56, end: 53, type: 'snake' },
  62: { start: 62, end: 19, type: 'snake' },
  64: { start: 64, end: 60, type: 'snake' },
  87: { start: 87, end: 24, type: 'snake' },
  93: { start: 93, end: 73, type: 'snake' },
  95: { start: 95, end: 75, type: 'snake' },
  98: { start: 98, end: 78, type: 'snake' },
};
