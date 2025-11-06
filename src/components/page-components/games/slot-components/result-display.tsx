import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, TrendingDown } from "lucide-react";
import type { SlotSpinResponse } from "./types";

const ResultDisplay: React.FC<{ result: SlotSpinResponse | null }> = ({ result }) => {
  if (!result) return null;

  const isWin = result.netResult > 0;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={result.netResult}
        initial={{ scale: 0, rotate: -180, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        exit={{ scale: 0, rotate: 180, opacity: 0 }}
        className={`rounded-2xl p-4 shadow-2xl sm:p-6 ${
          isWin
            ? "bg-gradient-to-r from-green-500 via-emerald-500 to-green-600"
            : "bg-gradient-to-r from-gray-700 to-gray-800"
        }`}
      >
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            {isWin ? (
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="h-6 w-6 text-yellow-300 sm:h-8 sm:w-8" />
              </motion.div>
            ) : (
              <TrendingDown className="h-6 w-6 sm:h-8 sm:w-8" />
            )}
            <span className="text-xl font-bold sm:text-2xl">
              {isWin ? "VÝHRA!" : "Zkuste znovu"}
            </span>
          </div>
          <div className="text-right">
            <div
              className={`text-2xl font-bold sm:text-3xl ${isWin ? "text-yellow-300" : ""}`}
            >
              {result.netResult > 0 ? "+" : ""}
              {result.netResult} Kč
            </div>
            {isWin && (
              <div className="text-sm text-yellow-100 opacity-90">
                Vyhrali jste: {result.totalWinnings} Kč
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ResultDisplay;
