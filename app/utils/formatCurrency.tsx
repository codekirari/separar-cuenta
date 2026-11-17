"use client";

export const formatCurrency = (amount: number): string => {
  const rounded = Math.round(amount || 0);
  const formatted = Math.abs(rounded)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${rounded < 0 ? "-" : ""}$ ${formatted}`;
};
