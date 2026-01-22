
import React from 'react';
import { GRID_SIZE, PORTALS, TOTAL_SQUARES } from '../constants';
import { MoveUp, MoveDown, Zap } from 'lucide-react';

interface BoardProps {
  playerPosition: number;
}

const Board: React.FC<BoardProps> = ({ playerPosition }) => {
  const renderSquares = () => {
    const squares = [];
    // Standard Snake & Ladder boards start 1 at bottom-left
    for (let row = GRID_SIZE - 1; row >= 0; row--) {
      const isEvenRowFromBottom = (GRID_SIZE - 1 - row) % 2 === 0;
      
      if (isEvenRowFromBottom) {
        // Left to Right
        for (let col = 0; col < GRID_SIZE; col++) {
          squares.push(renderSquare(row, col));
        }
      } else {
        // Right to Left
        for (let col = GRID_SIZE - 1; col >= 0; col--) {
          squares.push(renderSquare(row, col));
        }
      }
    }
    return squares;
  };

  const getSquareNumber = (row: number, col: number) => {
    const rowFromBottom = GRID_SIZE - 1 - row;
    const base = rowFromBottom * GRID_SIZE;
    const isEvenRowFromBottom = rowFromBottom % 2 === 0;
    return isEvenRowFromBottom ? base + col + 1 : base + (GRID_SIZE - 1 - col) + 1;
  };

  const renderSquare = (row: number, col: number) => {
    const num = getSquareNumber(row, col);
    const portal = PORTALS[num];
    const isPlayerHere = playerPosition === num;

    let bgColor = 'bg-slate-900/40';
    if ((row + col) % 2 === 0) bgColor = 'bg-slate-800/40';

    return (
      <div 
        key={num}
        className={`relative aspect-square border border-white/5 flex items-center justify-center transition-all duration-500 ${bgColor} group overflow-hidden`}
      >
        <span className="absolute top-1 left-1 text-[10px] md:text-xs text-slate-600 font-mono font-bold opacity-40 group-hover:opacity-100 transition-opacity">
          {num}
        </span>

        {portal && (
          <div className={`absolute inset-0 flex flex-col items-center justify-center pointer-events-none`}>
             <div className={`transition-transform duration-1000 group-hover:scale-110 ${portal.type === 'snake' ? 'text-rose-500' : 'text-emerald-400'}`}>
                {portal.type === 'snake' ? (
                  <div className="flex flex-col items-center">
                    <Zap className="w-5 h-5 animate-pulse" />
                    <span className="text-[8px] font-bold uppercase tracking-tighter opacity-60">Void</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <MoveUp className="w-5 h-5 animate-bounce" />
                    <span className="text-[8px] font-bold uppercase tracking-tighter opacity-60">Portal</span>
                  </div>
                )}
             </div>
             <div className={`absolute inset-0 opacity-10 ${portal.type === 'snake' ? 'bg-rose-500' : 'bg-emerald-500'}`}></div>
          </div>
        )}

        {isPlayerHere && (
          <div className="z-20 w-3/4 h-3/4 bg-gradient-to-tr from-indigo-500 to-purple-400 rounded-full shadow-[0_0_25px_rgba(99,102,241,1)] border-2 border-white/80 flex items-center justify-center animate-bounce">
            <div className="w-full h-full rounded-full bg-white/20 animate-ping absolute"></div>
            <span className="text-white text-[10px] md:text-xs font-bold tracking-tighter drop-shadow-md">YOU</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full max-w-[550px] aspect-square grid grid-cols-10 grid-rows-10 border-8 border-slate-900 rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] bg-slate-950 relative">
      {/* Decorative inner glow */}
      <div className="absolute inset-0 pointer-events-none border-[1px] border-white/10 rounded-xl z-10 shadow-[inset_0_0_100px_rgba(0,0,0,0.8)]"></div>
      {renderSquares()}
    </div>
  );
};

export default Board;
