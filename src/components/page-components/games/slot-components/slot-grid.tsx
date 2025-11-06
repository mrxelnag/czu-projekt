import React from "react";
import SlotReel from "./slot-reel.tsx";
import WinningLine from "./winning-line.tsx";

interface SlotGridProps {
  grid: string[][];
  isSpinning: boolean;
  winningRows?: number[];
}

const SlotGrid: React.FC<SlotGridProps> = ({
  grid,
  isSpinning,
  winningRows = [],
}) => {
  return (
    <div className="relative mx-auto w-full max-w-sm rounded-3xl bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 p-4 shadow-2xl sm:max-w-md sm:p-8">
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-yellow-500/10 to-transparent" />

      {/* Decorative corners */}
      <div className="absolute top-3 left-3 h-4 w-4 rounded-tl-lg border-t-4 border-l-4 border-yellow-400 sm:h-6 sm:w-6" />
      <div className="absolute top-3 right-3 h-4 w-4 rounded-tr-lg border-t-4 border-r-4 border-yellow-400 sm:h-6 sm:w-6" />
      <div className="absolute bottom-3 left-3 h-4 w-4 rounded-bl-lg border-b-4 border-l-4 border-yellow-400 sm:h-6 sm:w-6" />
      <div className="absolute right-3 bottom-3 h-4 w-4 rounded-br-lg border-r-4 border-b-4 border-yellow-400 sm:h-6 sm:w-6" />

      <div className="relative space-y-3 sm:space-y-4">
        {winningRows.map((rowIndex) => (
          <WinningLine key={rowIndex} rowIndex={rowIndex} />
        ))}

        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center gap-3 sm:gap-4">
            {row.map((symbol, colIndex) => (
              <SlotReel
                key={`${rowIndex}-${colIndex}`}
                symbol={symbol}
                isSpinning={isSpinning}
                delay={colIndex * 200}
                isWinning={winningRows.includes(rowIndex)}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SlotGrid;
