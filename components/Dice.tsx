
import React, { useState, useEffect, useCallback } from 'react';

interface DiceProps {
  value: number;
  isRolling: boolean;
  onRollComplete: (value: number) => void;
}

const Dice: React.FC<DiceProps> = ({ value, isRolling, onRollComplete }) => {
  const [rotation, setRotation] = useState({ x: 0, y: 0, z: 0 });

  const getRotationForValue = useCallback((val: number) => {
    switch (val) {
      case 1: return { x: 0, y: 0, z: 0 };
      case 2: return { x: 0, y: 270, z: 0 }; 
      case 3: return { x: 90, y: 0, z: 0 };  
      case 4: return { x: -90, y: 0, z: 0 }; 
      case 5: return { x: 0, y: 90, z: 0 };  
      case 6: return { x: 0, y: 180, z: 0 }; 
      default: return { x: 0, y: 0, z: 0 };
    }
  }, []);

  useEffect(() => {
    if (isRolling) {
      // First, jump to a random wild rotation to simulate the "toss" start
      const randomStart = {
        x: Math.random() * 360,
        y: Math.random() * 360,
        z: Math.random() * 360
      };
      setRotation(randomStart);

      // Then, animate to the final value with a large rotation spin
      const timer = setTimeout(() => {
        const target = getRotationForValue(value);
        // We add 720 degrees to ensure a clear "spinning" motion (two full turns)
        // which represents the "one rotation" action requested
        setRotation({
          x: target.x + 720,
          y: target.y + 720,
          z: target.z + 720
        });

        // Finalize after the transition completes
        const completeTimer = setTimeout(() => {
          onRollComplete(value);
        }, 600);
        return () => clearTimeout(completeTimer);
      }, 50);

      return () => clearTimeout(timer);
    }
  }, [isRolling, value, getRotationForValue, onRollComplete]);

  const faceStyle = "absolute w-20 h-20 bg-indigo-950 border-2 border-indigo-400/50 flex items-center justify-center text-white text-4xl font-bangers rounded-xl shadow-[inset_0_0_20px_rgba(99,102,241,0.5)] backface-hidden";

  return (
    <div className="flex flex-col items-center gap-4 py-4">
      <div className="dice-container w-20 h-20">
        <div
          className="dice-cube relative w-full h-full transition-transform duration-[600ms] ease-out"
          style={{ 
            transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) rotateZ(${rotation.z}deg)`,
            transformStyle: 'preserve-3d'
          }}
        >
          {/* Mapping of dots for a premium feel */}
          <div className={`${faceStyle}`} style={{ transform: 'rotateY(0deg) translateZ(40px)' }}>
            <div className="w-4 h-4 bg-white rounded-full"></div>
          </div>
          <div className={`${faceStyle}`} style={{ transform: 'rotateY(180deg) translateZ(40px)' }}>
             <div className="grid grid-cols-2 gap-2">
                {[1,2,3,4,5,6].map(i => <div key={i} className="w-3 h-3 bg-indigo-300 rounded-full"></div>)}
             </div>
          </div>
          <div className={`${faceStyle}`} style={{ transform: 'rotateX(90deg) translateZ(40px)' }}>
             <div className="grid grid-cols-2 gap-4">
                <div className="w-3 h-3 bg-indigo-300 rounded-full"></div>
                <div className="w-3 h-3 bg-indigo-300 rounded-full opacity-0"></div>
                <div className="w-3 h-3 bg-indigo-300 rounded-full opacity-0"></div>
                <div className="w-3 h-3 bg-indigo-300 rounded-full"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-indigo-300 rounded-full"></div>
             </div>
          </div>
          <div className={`${faceStyle}`} style={{ transform: 'rotateX(-90deg) translateZ(40px)' }}>
             <div className="grid grid-cols-2 gap-4">
                <div className="w-3 h-3 bg-indigo-300 rounded-full"></div>
                <div className="w-3 h-3 bg-indigo-300 rounded-full"></div>
                <div className="w-3 h-3 bg-indigo-300 rounded-full"></div>
                <div className="w-3 h-3 bg-indigo-300 rounded-full"></div>
             </div>
          </div>
          <div className={`${faceStyle}`} style={{ transform: 'rotateY(-90deg) translateZ(40px)' }}>
             <div className="flex flex-col gap-4 rotate-45">
                <div className="w-3 h-3 bg-indigo-300 rounded-full"></div>
                <div className="w-3 h-3 bg-indigo-300 rounded-full"></div>
                <div className="w-3 h-3 bg-indigo-300 rounded-full"></div>
             </div>
          </div>
          <div className={`${faceStyle}`} style={{ transform: 'rotateY(90deg) translateZ(40px)' }}>
             <div className="flex flex-col gap-8 rotate-45">
                <div className="w-3 h-3 bg-indigo-300 rounded-full"></div>
                <div className="w-3 h-3 bg-indigo-300 rounded-full"></div>
             </div>
          </div>
        </div>
      </div>
      
      <div className="h-2 w-16 bg-indigo-500/20 rounded-full blur-md animate-pulse"></div>

      <style>{`
        .dice-container {
          perspective: 800px;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
      `}</style>
    </div>
  );
};

export default Dice;
