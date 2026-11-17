"use client";
import { PersonBreakdown } from "./PersonBreakdown";

export interface BillSummary {
  totalBillSubtotal: number;
  totalTax: number;
  totalTip: number;
  grandTotal: number;
  unassignedAmount: number;
  totalGuestsCost: number;
  hostsCount: number;
  guestsCount: number;
  breakdown: PersonBreakdown[];
}
