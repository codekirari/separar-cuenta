"use client";
import { Person } from "./Person";

export interface PersonBreakdown extends Person {
  ownSubtotal: number;
  ownTax: number;
  ownTip: number;
  ownTotal: number;
  guestCoverageShare: number;
  finalToPay: number;
}
