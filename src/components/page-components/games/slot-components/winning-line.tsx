import React from "react";
import { motion } from "framer-motion";

const WinningLine: React.FC<{ rowIndex: number }> = ({ rowIndex }) => {
  return (
    <motion.div
      initial={{ scaleX: 0, opacity: 0 }}
      animate={{ scaleX: 1, opacity: 1 }}
      transition={{ delay: 0.1 }}
      className="absolute right-0 left-0 h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent"
      // Adjust top position to fit the reel size
      style={{ top: `${rowIndex * 33.33 + 16.66}%` }}
    >
      <motion.div
        animate={{ x: ["-100%", "100%"] }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="h-full w-1/3 bg-gradient-to-r from-transparent via-white to-transparent"
      />
    </motion.div>
  );
};

export default WinningLine;
