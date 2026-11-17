"use client";

export interface BillItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  sharedBy: string[];
}
