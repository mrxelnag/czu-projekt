import React from "react";
import { motion } from "framer-motion";
import { SYMBOL_CONFIG } from "./config";

const Paytable: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-gray-700 bg-gray-800/30 p-3 backdrop-blur-sm"
    >
      <h3 className="mb-2 text-center text-xs font-bold tracking-wider text-white uppercase">
        Výplatní Tabulka
      </h3>
      <div className="space-y-1">
        {Object.entries(SYMBOL_CONFIG).map(([symbol, config]) => (
          <div key={symbol} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1">
              <span className="text-lg">{config.emoji}</span>
              <span className="text-lg">{config.emoji}</span>
              <span className="text-lg">{config.emoji}</span>
            </div>
            <span
              className={`bg-gradient-to-r text-base font-bold ${config.color} bg-clip-text text-transparent`}
            >
              {config.payout}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default Paytable;
