// Shared types for Slot game
export interface SlotSpinRequest {
  betAmount: number;
}

export interface SlotSpinResponse {
  grid: string[][];
  netResult: number;
  totalWinnings: number;
  newRound: any;
}
