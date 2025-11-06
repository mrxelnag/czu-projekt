// Shared configuration and constants for Slot game
export const SYMBOL_CONFIG = {
  A: {
    emoji: "💎",
    name: "Diamant",
    payout: "10x",
    color: "from-blue-400 to-cyan-500",
  },
  B: {
    emoji: "⭐",
    name: "Hvězda",
    payout: "5x",
    color: "from-yellow-400 to-orange-500",
  },
  C: {
    emoji: "🍒",
    name: "Třešeň",
    payout: "2x",
    color: "from-red-400 to-pink-500",
  },
} as const;

// Based on the longest reel's animation: 1500ms (spin duration) + 2*200ms (max delay for 3 reels)
export const SPIN_ANIMATION_DURATION = 500;
