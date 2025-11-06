import { motion, useSpring, useTransform } from "framer-motion";
import React, { useState, useEffect } from "react";
import { formatBTC } from "@/lib/utils.ts";

const JackpotDisplay = ({
  label,
  amount,
}: {
  label: string;
  amount: number;
}) => {
  // Create a motion value for the amount that will smoothly animate
  const animatedAmount = useSpring(amount, { stiffness: 100, damping: 30 });

  useEffect(() => {
    // Update the animatedAmount motion value whenever the 'amount' prop changes
    animatedAmount.set(amount);
  }, [amount, animatedAmount]);

  return (
    <div className="min-w-0 flex-1 px-1 text-center">
      <div className="text-xs font-medium tracking-wider text-gray-400 uppercase">
        {label}
      </div>
      <motion.div
        // Removed key={amount} to prevent re-mounting and snapping
        initial={{ y: -5, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.1 }}
        className="overflow-hidden text-xl leading-tight font-bold text-ellipsis whitespace-nowrap text-yellow-400"
      >
        {/* Use useTransform to format the smoothly animated number */}
        {useTransform(animatedAmount, (latest) => formatBTC(latest))}
      </motion.div>
    </div>
  );
};

export default function JackpotTopbar() {
  // Use small BTC values for jackpots
  const [jackpots, setJackpots] = useState({
    mini: 0.123,
    midi: 1.456,
    maxi: 10.123,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate slow BTC increase
      setJackpots((prevJackpots) => ({
        mini: prevJackpots.mini + Math.random() * 0.0000005,
        midi: prevJackpots.midi + Math.random() * 0.000005,
        maxi: prevJackpots.maxi + Math.random() * 0.000025,
      }));
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <nav className="z-20 flex w-full items-center justify-around rounded-b-xl border-b-[3px] border-yellow-400 bg-gray-900/50 px-2 py-1 text-gray-50 shadow-xl">
      <JackpotDisplay label="PARTIKŮV MINI JACKPOT" amount={jackpots.mini} />
      <JackpotDisplay label="MARKŮV MID JACKPOT" amount={jackpots.midi} />
      <JackpotDisplay label="JIRKY MEGA JACKPOT" amount={jackpots.maxi} />
    </nav>
  );
}
