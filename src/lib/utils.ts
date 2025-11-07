import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatBTC = (amount: number) => {
  // Use toFixed(6) for standard BTC display, replacing default Kč formatting
  return amount.toFixed(6).replace(".", ",") + " ₿";
};

export const formatSAT = (amount: number) => {
  return amount.toFixed(0).replace(".", ",") + " sat";
};
