
import React, { useState, useCallback } from 'react';
import Board from './components/Board';
import Dice from './components/Dice';
import { GameState } from './types';
import { PORTALS, TOTAL_SQUARES } from './constants';
import { getNarrativeComment } from './services/geminiService';
import { Info, RotateCcw, Dices, History, Sparkles, Trophy } from 'lucide-react';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    playerPosition: 1,
    isMoving: false,
    lastDiceRoll: 1,
    status: 'playing',
    history: ["The journey through the cosmos begins at Square 1."],
    narratorMessage: "Fortune favors the bold traveler.",
  });

  const [isRolling, setIsRolling] = useState(false);

  const addHistory = (msg: string) => {
    setGameState(prev => ({
      ...prev,
      history: [msg, ...prev.history].slice(0, 12)
    }));
  };

  const handleRollClick = () => {
    if (isRolling || gameState.isMoving || gameState.status === 'won') return;
    
    // 1. Generate the roll result immediately
    const roll = Math.floor(Math.random() * 6) + 1;
    setGameState(prev => ({ ...prev, lastDiceRoll: roll }));
    
    // 2. Start the dice rotation animation
    setIsRolling(true);
  };

  const processMove = useCallback(async (roll: number) => {
    // This is called by the Dice component after its 'one rotation' animation finishes
    setIsRolling(false);
    setGameState(prev => ({ ...prev, isMoving: true }));

    let currentPos = gameState.playerPosition;
    let targetPos = currentPos + roll;

    // Boundary check for exact finish
    if (targetPos > TOTAL_SQUARES) {
      addHistory(`Rolled ${roll}. Needed exactly ${TOTAL_SQUARES - currentPos} to reach the peak!`);
      await new Promise(r => setTimeout(r, 600));
      setGameState(prev => ({ ...prev, isMoving: false, narratorMessage: "So close, yet so far from destiny." }));
      return;
    }

    // Step-by-step movement animation
    for (let i = currentPos + 1; i <= targetPos; i++) {
      await new Promise(r => setTimeout(r, 200));
      setGameState(prev => ({ ...prev, playerPosition: i }));
    }

    // Check for Snake or Ladder portals
    const portal = PORTALS[targetPos];
    let finalPos = targetPos;
    let eventType: 'none' | 'snake' | 'ladder' | 'win' = 'none';

    if (portal) {
      eventType = portal.type;
      await new Promise(r => setTimeout(r, 700));
      addHistory(`${portal.type === 'snake' ? 'Pulled into a void' : 'Elevated by a star portal'} to ${portal.end}.`);
      finalPos = portal.end;
      setGameState(prev => ({ ...prev, playerPosition: finalPos }));
    }

    if (finalPos === TOTAL_SQUARES) {
      eventType = 'win';
      setGameState(prev => ({ ...prev, status: 'won' }));
      addHistory("Ascension complete. You are one with the stars.");
    }

    // AI Narrative commentary
    const aiComment = await getNarrativeComment(finalPos, roll, eventType);
    setGameState(prev => ({ 
      ...prev, 
      isMoving: false, 
      narratorMessage: aiComment 
    }));

  }, [gameState.playerPosition, gameState.isMoving, gameState.status]);

  const resetGame = () => {
    setGameState({
      playerPosition: 1,
      isMoving: false,
      lastDiceRoll: 1,
      status: 'playing',
      history: ["The timeline resets. A new path unfolds."],
      narratorMessage: "Let us see what the stars hold this time.",
    });
    setIsRolling(false);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 p-4 md:p-10 flex flex-col items-center selection:bg-indigo-500/30">
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600 rounded-full blur-[150px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600 rounded-full blur-[150px]"></div>
      </div>

      <header className="mb-10 text-center z-10">
        <h1 className="text-5xl md:text-7xl font-black font-bangers tracking-widest text-transparent bg-clip-text bg-gradient-to-b from-white via-indigo-200 to-indigo-500 drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]">
          CELESTIAL ASCENSION
        </h1>
        <div className="flex items-center justify-center gap-3 mt-4 text-indigo-400 font-semibold uppercase tracking-widest text-xs">
          <Sparkles className="w-4 h-4" />
          <span>Oracle Guided Journey</span>
          <Sparkles className="w-4 h-4" />
        </div>
      </header>

      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-10 items-start z-10">
        
        {/* Left: Stats */}
        <div className="lg:col-span-3 space-y-6 order-2 lg:order-1">
          <div className="bg-slate-900/40 border border-white/5 p-6 rounded-3xl shadow-2xl backdrop-blur-xl group hover:border-indigo-500/30 transition-colors">
            <h2 className="text-sm font-bold text-indigo-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Info className="w-4 h-4" /> Cosmic Progress
            </h2>
            <div className="space-y-6">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-slate-500 text-[10px] uppercase font-bold tracking-tighter">Current Square</p>
                  <p className="text-5xl font-black text-white">{gameState.playerPosition}</p>
                </div>
                <div className="text-right">
                  <p className="text-slate-500 text-[10px] uppercase font-bold tracking-tighter">Remaining</p>
                  <p className="text-xl font-bold text-indigo-300">{TOTAL_SQUARES - gameState.playerPosition}</p>
                </div>
              </div>
              <div className="relative h-3 bg-slate-950 rounded-full overflow-hidden border border-white/5">
                <div 
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-indigo-600 via-purple-500 to-emerald-400 transition-all duration-700 ease-out shadow-[0_0_15px_rgba(99,102,241,0.5)]"
                  style={{ width: `${gameState.playerPosition}%` }}
                />
              </div>
            </div>
          </div>

          <div className="bg-slate-900/40 border border-white/5 p-6 rounded-3xl shadow-2xl backdrop-blur-xl">
             <div className="flex flex-col gap-4">
              <button 
                onClick={handleRollClick}
                disabled={isRolling || gameState.isMoving || gameState.status === 'won'}
                className="group relative w-full overflow-hidden bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-black py-5 px-6 rounded-2xl transition-all shadow-[0_10px_25px_rgba(79,70,229,0.4)] flex items-center justify-center gap-3 active:scale-95 disabled:shadow-none"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]"></div>
                {gameState.status === 'won' ? <Trophy className="w-6 h-6" /> : <Dices className="w-6 h-6" />}
                <span className="text-lg uppercase tracking-wider">
                  {gameState.status === 'won' ? 'ASCENDED' : isRolling ? 'CONSULTING...' : 'ROLL ORACLE'}
                </span>
              </button>
              
              <button 
                onClick={resetGame}
                className="w-full bg-slate-800/50 hover:bg-slate-700/50 text-slate-400 hover:text-white py-4 rounded-2xl transition-all flex items-center justify-center gap-2 border border-white/5 text-xs font-bold uppercase tracking-widest"
              >
                <RotateCcw className="w-3 h-3" /> Reset Timeline
              </button>
            </div>
          </div>
        </div>

        {/* Center: Board */}
        <div className="lg:col-span-6 flex flex-col items-center order-1 lg:order-2">
          <div className="relative group p-2 bg-gradient-to-b from-indigo-500/20 to-transparent rounded-[2rem] shadow-2xl">
            <Board playerPosition={gameState.playerPosition} />
            
            {gameState.status === 'won' && (
              <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center z-50 rounded-2xl animate-in zoom-in duration-500 border-4 border-emerald-500/50">
                <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mb-6 animate-pulse shadow-[0_0_50px_rgba(16,185,129,0.5)]">
                  <Trophy className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-6xl font-bangers text-emerald-400 mb-2 tracking-widest">VICTORY</h3>
                <p className="text-slate-400 mb-10 font-medium tracking-wide">You have transcended the mortal grid.</p>
                <button 
                  onClick={resetGame}
                  className="bg-emerald-600 hover:bg-emerald-500 px-12 py-4 rounded-full font-black text-white shadow-xl transition-all hover:scale-110 active:scale-95 uppercase tracking-widest text-sm"
                >
                  New Cycle
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right: AI & Logs */}
        <div className="lg:col-span-3 space-y-6 order-3">
          <div className="bg-indigo-950/20 border border-indigo-500/20 p-8 rounded-3xl shadow-2xl backdrop-blur-xl min-h-[200px] flex flex-col items-center justify-center text-center relative group">
            <div className="absolute -top-3 -right-3 p-3 bg-indigo-600 rounded-2xl shadow-lg rotate-12 group-hover:rotate-0 transition-transform">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <p className="text-indigo-400 font-bold text-[10px] uppercase tracking-[0.3em] mb-4">
               Celestial Oracle
            </p>
            <p className="text-lg md:text-xl font-serif italic text-white/90 leading-relaxed">
              "{gameState.narratorMessage}"
            </p>
          </div>

          <div className="flex justify-center py-6 bg-slate-900/30 rounded-3xl border border-white/5 shadow-inner">
             <Dice 
              value={gameState.lastDiceRoll} 
              isRolling={isRolling} 
              onRollComplete={processMove} 
            />
          </div>

          <div className="bg-slate-900/40 border border-white/5 p-6 rounded-3xl shadow-2xl backdrop-blur-xl">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <History className="w-4 h-4" /> Timeline Records
            </h2>
            <div className="h-44 overflow-y-auto space-y-4 pr-2 scrollbar-thin scrollbar-thumb-indigo-900/50">
              {gameState.history.map((log, idx) => (
                <div key={idx} className={`text-[11px] leading-relaxed transition-all duration-500 ${idx === 0 ? 'text-indigo-300 font-bold translate-x-1' : 'text-slate-500 border-l border-slate-800 ml-1 pl-3'}`}>
                  {idx === 0 && <span className="inline-block w-1 h-1 bg-indigo-400 rounded-full mr-2 mb-0.5"></span>}
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <footer className="mt-16 text-slate-700 text-[10px] font-bold uppercase tracking-[0.4em] pb-10 flex items-center gap-4">
        <span>Celestial Ascension</span>
        <span className="w-1 h-1 bg-slate-800 rounded-full"></span>
        <span>A.I. Narrated Experience</span>
        <span className="w-1 h-1 bg-slate-800 rounded-full"></span>
        <span>2024</span>
      </footer>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        ::-webkit-scrollbar {
          width: 3px;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(99, 102, 241, 0.2);
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(99, 102, 241, 0.4);
        }
      `}</style>
    </div>
  );
};

export default App;
