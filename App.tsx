
import React, { useState, useCallback } from 'react';
import Board from './components/Board';
import Dice from './components/Dice';
import { GameState } from './types';
import { PORTALS, TOTAL_SQUARES } from './constants';
import { getNarrativeComment } from './services/geminiService';
import { Info, RotateCcw, Dices, History, Sparkles, Trophy, Loader2 } from 'lucide-react';

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
      history: [msg, ...prev.history].slice(0, 10)
    }));
  };

  const handleRollClick = () => {
    if (isRolling || gameState.isMoving || gameState.status === 'won') return;
    
    const roll = Math.floor(Math.random() * 6) + 1;
    setGameState(prev => ({ ...prev, lastDiceRoll: roll }));
    setIsRolling(true);
  };

  const processMove = useCallback(async (roll: number) => {
    setIsRolling(false);
    setGameState(prev => ({ ...prev, isMoving: true }));

    let currentPos = gameState.playerPosition;
    let targetPos = currentPos + roll;

    // Bounce-back or boundary logic
    if (targetPos > TOTAL_SQUARES) {
      addHistory(`Rolled ${roll}. Needed ${TOTAL_SQUARES - currentPos} for the peak.`);
      await new Promise(r => setTimeout(r, 600));
      setGameState(prev => ({ ...prev, isMoving: false, narratorMessage: "Destiny is not yet reached." }));
      return;
    }

    // Step-by-step movement
    for (let i = currentPos + 1; i <= targetPos; i++) {
      await new Promise(r => setTimeout(r, 150));
      setGameState(prev => ({ ...prev, playerPosition: i }));
    }

    // Check for Snake or Ladder portals
    const portal = PORTALS[targetPos];
    let finalPos = targetPos;
    let eventType: 'none' | 'snake' | 'ladder' | 'win' = 'none';

    if (portal) {
      eventType = portal.type;
      await new Promise(r => setTimeout(r, 800));
      addHistory(`${portal.type === 'snake' ? 'Lost in void' : 'Ascended via portal'} to square ${portal.end}.`);
      finalPos = portal.end;
      setGameState(prev => ({ ...prev, playerPosition: finalPos }));
    }

    if (finalPos === TOTAL_SQUARES) {
      eventType = 'win';
      setGameState(prev => ({ ...prev, status: 'won' }));
      addHistory("Ascension complete. You have joined the constellation.");
    }

    // AI Narrative
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
    <div className="min-h-screen bg-[#020617] text-slate-100 p-4 md:p-8 flex flex-col items-center selection:bg-indigo-500/30 font-sans">
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute top-[-15%] left-[-10%] w-[50%] h-[50%] bg-indigo-900 rounded-full blur-[180px]"></div>
        <div className="absolute bottom-[-15%] right-[-10%] w-[50%] h-[50%] bg-purple-900 rounded-full blur-[180px]"></div>
      </div>

      <header className="mb-8 text-center z-10">
        <h1 className="text-4xl md:text-6xl font-black font-bangers tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-b from-white via-indigo-200 to-indigo-500 drop-shadow-2xl">
          CELESTIAL ASCENSION
        </h1>
        <div className="flex items-center justify-center gap-3 mt-4 text-indigo-400 font-bold uppercase tracking-[0.3em] text-[10px]">
          <Sparkles className="w-3 h-3" />
          <span>Oracle Guided Odyssey</span>
          <Sparkles className="w-3 h-3" />
        </div>
      </header>

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start z-10">
        
        {/* Left column */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-slate-900/40 border border-white/5 p-5 rounded-3xl shadow-xl backdrop-blur-md">
            <h2 className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Info className="w-3 h-3" /> Progress Report
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-baseline">
                <div>
                  <p className="text-slate-500 text-[9px] uppercase font-bold tracking-tighter">Current</p>
                  <p className="text-4xl font-black text-white font-orbitron">{gameState.playerPosition}</p>
                </div>
                <div className="text-right">
                  <p className="text-slate-500 text-[9px] uppercase font-bold tracking-tighter">To Reach Peak</p>
                  <p className="text-lg font-bold text-indigo-300 font-orbitron">{TOTAL_SQUARES - gameState.playerPosition}</p>
                </div>
              </div>
              <div className="h-2 bg-slate-950 rounded-full overflow-hidden border border-white/5">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-600 to-purple-500 transition-all duration-700 shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                  style={{ width: `${gameState.playerPosition}%` }}
                />
              </div>
            </div>
          </div>

          <button 
            onClick={handleRollClick}
            disabled={isRolling || gameState.isMoving || gameState.status === 'won'}
            className="group relative w-full overflow-hidden bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-black py-4 rounded-2xl transition-all shadow-xl flex items-center justify-center gap-3 active:scale-95 border-b-4 border-indigo-800 disabled:border-transparent"
          >
            {isRolling ? <Loader2 className="w-5 h-5 animate-spin" /> : gameState.status === 'won' ? <Trophy className="w-5 h-5" /> : <Dices className="w-5 h-5" />}
            <span className="text-sm uppercase tracking-[0.2em]">
              {gameState.status === 'won' ? 'ASCENDED' : isRolling ? 'CONSULTING' : 'ROLL ORACLE'}
            </span>
          </button>
          
          <button 
            onClick={resetGame}
            className="w-full bg-slate-800/30 hover:bg-slate-800/60 text-slate-500 hover:text-white py-3 rounded-xl transition-all flex items-center justify-center gap-2 border border-white/5 text-[9px] font-bold uppercase tracking-widest"
          >
            <RotateCcw className="w-3 h-3" /> Reset Timeline
          </button>
        </div>

        {/* Center column */}
        <div className="lg:col-span-6 flex justify-center">
          <div className="relative p-1.5 bg-indigo-500/10 rounded-[2.2rem] shadow-3xl">
            <Board playerPosition={gameState.playerPosition} />
            
            {gameState.status === 'won' && (
              <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-lg flex flex-col items-center justify-center z-50 rounded-2xl animate-in fade-in zoom-in duration-500">
                <div className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center mb-6 animate-bounce shadow-2xl">
                  <Trophy className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-5xl font-bangers text-indigo-400 mb-2 tracking-widest">TRANSCENDED</h3>
                <p className="text-slate-400 mb-8 font-medium tracking-wide text-xs">You have escaped the mortal grid.</p>
                <button 
                  onClick={resetGame}
                  className="bg-indigo-600 hover:bg-indigo-500 px-10 py-3 rounded-full font-bold text-white shadow-xl transition-all hover:scale-110 active:scale-95 uppercase tracking-widest text-[10px]"
                >
                  New Cycle
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right column */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-indigo-950/30 border border-indigo-500/20 p-6 rounded-3xl shadow-xl backdrop-blur-md min-h-[160px] flex flex-col items-center justify-center text-center">
            <p className="text-indigo-500 font-bold text-[9px] uppercase tracking-[0.3em] mb-4">
               Celestial Oracle
            </p>
            <p className="text-base font-serif italic text-white/90 leading-relaxed px-2">
              "{gameState.narratorMessage}"
            </p>
          </div>

          <div className="flex justify-center p-4 bg-slate-900/20 rounded-3xl border border-white/5">
             <Dice 
              value={gameState.lastDiceRoll} 
              isRolling={isRolling} 
              onRollComplete={processMove} 
            />
          </div>

          <div className="bg-slate-900/40 border border-white/5 p-5 rounded-3xl shadow-xl overflow-hidden">
            <h2 className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-4 flex items-center gap-2">
              <History className="w-3 h-3" /> Astral Records
            </h2>
            <div className="h-32 overflow-y-auto space-y-3 pr-2 scrollbar-thin">
              {gameState.history.map((log, idx