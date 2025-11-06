import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { SYMBOL_CONFIG } from "./config";

interface SlotReelProps {
  symbol: string;
  isSpinning: boolean;
  delay: number;
  isWinning?: boolean;
}

const SlotReel: React.FC<SlotReelProps> = ({
  symbol,
  isSpinning,
  delay,
  isWinning = false,
}) => {
  const symbols = React.useMemo(() => ["A", "B", "C"], []);
  const [displaySymbol, setDisplaySymbol] = useState(symbol || "A");

  useEffect(() => {
    if (isSpinning) {
      // Start perpetual random spinning
      const interval = setInterval(() => {
        setDisplaySymbol(symbols[Math.floor(Math.random() * symbols.length)]);
      }, 50);

      // Stop spinning and set the final symbol after the duration
      const timeout = setTimeout(() => {
        clearInterval(interval);
        setDisplaySymbol(symbol);
      }, 1500 + delay); // Spin duration: 1500ms + individual reel delay

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    } else {
      // Ensure the correct final symbol is displayed when not spinning
      setDisplaySymbol(symbol);
    }
  }, [isSpinning, symbol, delay, symbols]);

  const config =
    SYMBOL_CONFIG[displaySymbol as keyof typeof SYMBOL_CONFIG] ||
    SYMBOL_CONFIG["A"];

  return (
    <motion.div
      className={`relative flex h-20 w-20 flex-col items-center justify-center overflow-hidden rounded-xl border-2 bg-gradient-to-br from-gray-800 to-gray-900 shadow-inner sm:h-24 sm:w-24 ${
        isWinning ? "border-yellow-400" : "border-gray-700"
      }`}
      animate={
        isSpinning
          ? {
              y: [0, -10, 0],
              scale: [1, 0.95, 1],
            }
          : isWinning
            ? {
                scale: [1, 1.05, 1],
                rotate: [0, -2, 2, 0],
              }
            : {}
      }
      transition={
        isSpinning
          ? {
              duration: 0.1,
              repeat: Infinity,
              delay: delay / 1000,
            }
          : {
              duration: 0.5,
              repeat: Infinity,
            }
      }
    >
      {isWinning && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-yellow-400/30 to-orange-500/30"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      )}

      <div
        className={`absolute inset-0 bg-gradient-to-b ${config.color} opacity-20`}
      />

      <motion.div
        key={displaySymbol}
        initial={{ y: -50, opacity: 0, scale: 0.5 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        className="relative z-10 flex flex-col items-center"
      >
        <span className="mb-1 text-3xl sm:text-4xl">{config.emoji}</span>
        {/*<span className="text-xs font-bold text-gray-300">{displaySymbol}</span>*/}
      </motion.div>
    </motion.div>
  );
};

export default SlotReel;
