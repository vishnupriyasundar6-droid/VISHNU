
import React, { useState, useEffect, useRef } from 'react';

interface DiceProps {
  value: number;
  isRolling: boolean;
  onRollComplete: (value: number) => void;
}

const Dice: React.FC<DiceProps> = ({ value, isRolling, onRollComplete }) => {
  const [rotation, setRotation] = useState({ x: 0, y: 0, z: 0 });
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isRolling) {
      // Add multiple full rotations (360 * n) to make it look like it's spinning fast
      const extraRots = 5;
      const target = getRotationForValue(value);
      
      setRotation({
        x: target.x + (360 * extraRots),
        y: target.y + (360 * extraRots),
        z: target.z + (360 * extraRots)
      });

      const timer = setTimeout(() => {
        onRollComplete(value);
      }, 800); // Animation duration

      return () => clearTimeout(timer);
    }
  }, [isRolling, value]);

  const getRotationForValue = (val: number) => {
    // Standard dice mapping for a 3D cube
    switch (val) {
      case 1: return { x: 0, y: 0, z: 0 };
      case 2: return { x: 0, y: 270, z: 0 }; // Right
      case 3: return { x: 90, y: 0, z: 0 };  // Top
      case 4: return { x: -90, y: 0, z: 0 }; // Bottom
      case 5: return { x: 0, y: 90, z: 0 };  // Left
      case 6: return { x: 0, y: 180, z: 0 }; // Back
      default: return { x: 0, y: 0, z: 0 };
    }
  };

  const faceStyle = "absolute w-20 h-20 bg-gradient-to-br from-indigo-500 to-indigo-700 border-2 border-indigo-400/50 flex items-center justify-center text-white text-4xl font-bangers rounded-xl shadow-[inset_0_0_15px_rgba(255,255,255,0.2)] backface-hidden";

  return (
    <div className="flex flex-col items-center gap-6 py-4">
      <div className="dice-container w-20 h-20">
        <div
          className="dice-cube relative w-full h-full transition-transform duration-[800ms] cubic-bezier(0.17, 0.67, 0.83, 0.67)"
          style={{ 
            transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) rotateZ(${rotation.z}deg)`,
            transformStyle: 'preserve-3d'
          }}
        >
          {/* Front: 1 */}
          <div className={`${faceStyle}`} style={{ transform: 'rotateY(0deg) translateZ(40px)' }}>1</div>
          {/* Back: 6 */}
          <div className={`${faceStyle}`} style={{ transform: 'rotateY(180deg) translateZ(40px)' }}>6</div>
          {/* Top: 3 */}
          <div className={`${faceStyle}`} style={{ transform: 'rotateX(90deg) translateZ(40px)' }}>3</div>
          {/* Bottom: 4 */}
          <div className={`${faceStyle}`} style={{ transform: 'rotateX(-90deg) translateZ(40px)' }}>4</div>
          {/* Left: 5 */}
          <div className={`${faceStyle}`} style={{ transform: 'rotateY(-90deg) translateZ(40px)' }}>5</div>
          {/* Right: 2 */}
          <div className={`${faceStyle}`} style={{ transform: 'rotateY(90deg) translateZ(40px)' }}>2</div>
        </div>
      </div>
      
      <div className="h-2 w-16 bg-black/40 rounded-full blur-md animate-pulse"></div>

      <style>{`
        .dice-container {
          perspective: 600px;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .cubic-bezier {
          transition-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1);
        }
      `}</style>
    </div>
  );
};

export default Dice;
