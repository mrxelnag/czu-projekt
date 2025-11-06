import React, { useState } from "react";
import { motion } from "framer-motion";
import { Coins, Play, Sparkles } from "lucide-react";
import { useSpinSlotMachine } from "@/api/spin/slot.ts";
import { useAuth } from "@/lib/authentication.ts";
import SlotGrid from "./slot-components/slot-grid.tsx";
import ResultDisplay from "./slot-components/result-display.tsx";
import Paytable from "./slot-components/paytable.tsx";
import { SPIN_ANIMATION_DURATION } from "./slot-components/config";
import type { SlotSpinResponse } from "./slot-components/types";

// --- Main Slot Machine Component (Updated state and handleSpin logic) ---
const SlotMachine = () => {
  const [grid, setGrid] = useState<string[][]>([
    ["A", "B", "C"],
    ["C", "A", "B"],
    ["B", "C", "A"],
  ]);
  const [betAmount, setBetAmount] = useState(10);
  const [result, setResult] = useState<SlotSpinResponse | null>(null);
  const [winningRows, setWinningRows] = useState<number[]>([]);
  // New state to manage the full animation duration
  const [isAnimating, setIsAnimating] = useState(false);

  const { user } = useAuth();
  const balance = user?.current_balance || 0;

  // useSpinSlotMachine handles the API request state (isPending)
  const { mutate: spin, isPending } = useSpinSlotMachine();

  const handleSpin = () => {
    if (betAmount > balance) {
      alert("Nedostatečný zůstatek!");
      return;
    }

    setResult(null);
    setWinningRows([]);
    // Start the animation state
    setIsAnimating(true);

    spin(
      { betAmount },
      {
        onSuccess: (data: SlotSpinResponse) => {
          setGrid(data.grid);

          setTimeout(() => {
            // Find winning rows
            const winners: number[] = [];
            data.grid.forEach((row, idx) => {
              // Check for 3-in-a-row
              if (row.every((symbol) => symbol === row[0])) {
                winners.push(idx);
              }
            });

            // Set results/winners and stop the animation state
            setWinningRows(winners);
            setResult(data);
            setIsAnimating(false);
          }, SPIN_ANIMATION_DURATION);
        },
        onError: () => {
          // Stop animation on error as well
          setIsAnimating(false);
        },
      },
    );
  };

  // Combine `isPending` (API state) and `isAnimating` (UI state)
  const isSpinning = isPending || isAnimating;

  const betOptions = [5, 10, 25, 50, 100];

  return (
    // Adjusted container class for better responsiveness
    <div className="flex min-h-screen items-center justify-center rounded-lg bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 p-4">
      <div className="w-full max-w-lg space-y-4 sm:space-y-6 lg:max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center"
        >
          <motion.h1
            className="mb-2 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 bg-clip-text text-4xl font-bold text-transparent sm:mb-4 sm:text-6xl"
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
            style={{ backgroundSize: "200% 200%" }}
          >
            🎰 HERNÍ AUTOMAT 🎰
          </motion.h1>
          <div className="flex items-center justify-center gap-3 text-xl font-bold text-yellow-400 sm:text-2xl">
            <Coins className="h-6 w-6 sm:h-8 sm:w-8" />
            <motion.span
              key={balance}
              initial={{ scale: 1.5, color: "#10b981" }}
              animate={{ scale: 1, color: "#facc15" }}
            >
              {balance} Kč
            </motion.span>
          </div>
        </motion.div>

        {/* Main Content Grid - Adjusted for better mobile/desktop flow */}
        <div className="grid gap-4 lg:grid-cols-[1fr,200px] lg:gap-6">
          {/* Left/Main Column - Slot Grid and Result */}
          <div className="order-2 space-y-4 sm:space-y-6 lg:order-1">
            {/* Slot Grid */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <SlotGrid
                grid={grid}
                isSpinning={isSpinning}
                winningRows={winningRows}
              />
            </motion.div>

            {/* Result Display */}
            {result && <ResultDisplay result={result} />}
          </div>
        </div>

        {/* Controls */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="space-y-4 rounded-2xl border border-gray-700 bg-gray-800/50 p-4 backdrop-blur-sm sm:space-y-5 sm:p-6"
        >
          {/* Bet Amount Selection */}
          <div>
            <label className="mb-2 block text-sm font-medium text-white">
              Vyberte výši sázky:
            </label>
            <div className="flex flex-wrap gap-2">
              {betOptions.map((amount) => (
                <motion.button
                  key={amount}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setBetAmount(amount)}
                  disabled={isSpinning}
                  className={`min-w-[60px] flex-1 rounded-lg px-3 py-2 text-sm font-bold transition-all sm:px-4 sm:py-3 sm:text-base ${
                    betAmount === amount
                      ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 shadow-lg shadow-yellow-500/50"
                      : "bg-gray-700 text-white hover:bg-gray-600"
                  } ${isSpinning ? "cursor-not-allowed opacity-50" : ""}`}
                >
                  {amount} Kč
                </motion.button>
              ))}
            </div>
          </div>

          {/* Spin Button */}
          <motion.button
            whileHover={
              !isSpinning && betAmount <= balance ? { scale: 1.02 } : {}
            }
            whileTap={
              !isSpinning && betAmount <= balance ? { scale: 0.98 } : {}
            }
            onClick={handleSpin}
            disabled={isSpinning || betAmount > balance}
            className={`flex w-full items-center justify-center gap-3 rounded-xl py-3 text-lg font-bold transition-all sm:py-5 sm:text-xl ${
              isSpinning || betAmount > balance
                ? "cursor-not-allowed bg-gray-600 text-gray-400"
                : "bg-primary bg-gradient-to-r text-white shadow-2xl shadow-green-500/50 hover:shadow-green-500/70"
            }`}
          >
            {isSpinning ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="h-6 w-6" />
                </motion.div>
                Točení...
              </>
            ) : (
              <>
                <Play className="h-6 w-6" />
                Roztočit za {betAmount} Kč
              </>
            )}
          </motion.button>
        </motion.div>
        <div className="order-1 lg:order-2">
          <Paytable />
        </div>
      </div>
    </div>
  );
};

export default SlotMachine;
