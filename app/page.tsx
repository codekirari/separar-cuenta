"use client";

import { useState, useMemo } from "react";
import { Person } from "./models/Person";
import { BillItem } from "./models/BillItem";
import { PersonBreakdown } from "./models/PersonBreakdown";
import { BillSummary } from "./models/BillSummary";
import { formatCurrency } from "./utils/formatCurrency";
import { PeopleManager } from "./components/PeopleManager";
import { BillHeader } from "./components/BillHeader";
import { ItemsTable } from "./components/ItemsTable";
import { SettlementBreakdown } from "./components/SettlementBreakdown";
import { TaxTipSettings } from "./components/TaxTipSettings";

const INITIAL_PEOPLE: Person[] = [
  { id: "p1", name: "Camilo", isInvited: false },
  { id: "p2", name: "Sofía", isInvited: false },
  { id: "p3", name: "Andrés", isInvited: true },
  { id: "p4", name: "Valentina", isInvited: false },
];

const INITIAL_ITEMS: BillItem[] = [
  {
    id: "i1",
    name: "Entrada - Nachos Supremos",
    quantity: 1,
    unitPrice: 36000,
    sharedBy: ["p1", "p2", "p3", "p4"],
  },
  {
    id: "i2",
    name: "Hamburguesa Artesanal",
    quantity: 2,
    unitPrice: 32000,
    sharedBy: ["p1", "p3"],
  },
  {
    id: "i3",
    name: "Pasta Alfredo con Pollo",
    quantity: 1,
    unitPrice: 38000,
    sharedBy: ["p2"],
  },
  {
    id: "i4",
    name: "Ensalada César",
    quantity: 1,
    unitPrice: 29000,
    sharedBy: ["p4"],
  },
  {
    id: "i5",
    name: "Jarra de Limonada de Coco",
    quantity: 2,
    unitPrice: 22000,
    sharedBy: ["p1", "p2", "p3", "p4"],
  },
];

export default function Home() {
  const [people, setPeople] = useState<Person[]>(INITIAL_PEOPLE);
  const [items, setItems] = useState<BillItem[]>(INITIAL_ITEMS);
  const [taxRate, setTaxRate] = useState<number>(8);
  const [tipRate, setTipRate] = useState<number>(10);
  const [guestSplitMode, setGuestSplitMode] = useState<
    "equal" | "proportional"
  >("equal");
  const [copiedSummary, setCopiedSummary] = useState(false);

  const handleAddPerson = (name: string) => {
    const newPerson: Person = {
      id: `p-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name,
      isInvited: false,
    };
    setPeople((prev) => [...prev, newPerson]);
  };

  const toggleInvited = (personId: string) => {
    setPeople((prev) =>
      prev.map((p) =>
        p.id === personId ? { ...p, isInvited: !p.isInvited } : p,
      ),
    );
  };

  const removePerson = (personId: string) => {
    if (people.length <= 1) return;
    setPeople((prev) => prev.filter((p) => p.id !== personId));
    setItems((prev) =>
      prev.map((item) => ({
        ...item,
        sharedBy: item.sharedBy.filter((id) => id !== personId),
      })),
    );
  };

  const handleAddItem = () => {
    const newItem: BillItem = {
      id: `i-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name: "",
      quantity: 1,
      unitPrice: 0,
      sharedBy: people.map((p) => p.id),
    };
    setItems((prev) => [...prev, newItem]);
  };

  const updateItem = (
    itemId: string,
    field: keyof Omit<BillItem, "id" | "sharedBy">,
    value: string | number,
  ) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, [field]: value } : item,
      ),
    );
  };

  const togglePersonInItem = (itemId: string, personId: string) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== itemId) return item;
        const exists = item.sharedBy.includes(personId);
        return {
          ...item,
          sharedBy: exists
            ? item.sharedBy.filter((id) => id !== personId)
            : [...item.sharedBy, personId],
        };
      }),
    );
  };

  const selectAllForItem = (itemId: string) => {
    const allIds = people.map((p) => p.id);
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== itemId) return item;
        const allSelected = allIds.every((id) => item.sharedBy.includes(id));
        return {
          ...item,
          sharedBy: allSelected ? [] : allIds,
        };
      }),
    );
  };

  const removeItem = (itemId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const summary: BillSummary = useMemo(() => {
    const rawSubtotalByPerson: Record<string, number> = {};
    people.forEach((p) => {
      rawSubtotalByPerson[p.id] = 0;
    });

    let totalBillSubtotal = 0;
    let unassignedAmount = 0;

    items.forEach((item) => {
      const lineTotal =
        (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0);
      totalBillSubtotal += lineTotal;

      const validConsumers = item.sharedBy.filter((id) =>
        people.some((p) => p.id === id),
      );

      if (validConsumers.length === 0) {
        unassignedAmount += lineTotal;
      } else {
        const sharePerConsumer = lineTotal / validConsumers.length;
        validConsumers.forEach((personId) => {
          rawSubtotalByPerson[personId] =
            (rawSubtotalByPerson[personId] || 0) + sharePerConsumer;
        });
      }
    });

    const taxMultiplier = (Number(taxRate) || 0) / 100;
    const tipMultiplier = (Number(tipRate) || 0) / 100;

    const totalTax = totalBillSubtotal * taxMultiplier;
    const totalTip = totalBillSubtotal * tipMultiplier;
    const grandTotal = totalBillSubtotal + totalTax + totalTip;

    const hosts = people.filter((p) => !p.isInvited);
    const guests = people.filter((p) => p.isInvited);

    const personOwnGrandTotal: Record<string, number> = {};
    let totalGuestsCost = 0;
    let totalHostsOwnCost = 0;

    people.forEach((p) => {
      const sub = rawSubtotalByPerson[p.id] || 0;
      const ownTotal = sub * (1 + taxMultiplier + tipMultiplier);
      personOwnGrandTotal[p.id] = ownTotal;

      if (p.isInvited) {
        totalGuestsCost += ownTotal;
      } else {
        totalHostsOwnCost += ownTotal;
      }
    });

    const breakdown: PersonBreakdown[] = people.map((p) => {
      const ownSubtotal = rawSubtotalByPerson[p.id] || 0;
      const ownTax = ownSubtotal * taxMultiplier;
      const ownTip = ownSubtotal * tipMultiplier;
      const ownTotal = personOwnGrandTotal[p.id] || 0;

      if (p.isInvited) {
        return {
          ...p,
          ownSubtotal,
          ownTax,
          ownTip,
          ownTotal,
          guestCoverageShare: 0,
          finalToPay: 0,
        };
      }

      let guestCoverageShare = 0;
      if (guests.length > 0 && hosts.length > 0 && totalGuestsCost > 0) {
        if (guestSplitMode === "equal") {
          guestCoverageShare = totalGuestsCost / hosts.length;
        } else {
          guestCoverageShare =
            totalHostsOwnCost > 0
              ? (ownTotal / totalHostsOwnCost) * totalGuestsCost
              : totalGuestsCost / hosts.length;
        }
      }

      return {
        ...p,
        ownSubtotal,
        ownTax,
        ownTip,
        ownTotal,
        guestCoverageShare,
        finalToPay: ownTotal + guestCoverageShare,
      };
    });

    return {
      totalBillSubtotal,
      totalTax,
      totalTip,
      grandTotal,
      unassignedAmount,
      totalGuestsCost,
      hostsCount: hosts.length,
      guestsCount: guests.length,
      breakdown,
    };
  }, [people, items, taxRate, tipRate, guestSplitMode]);

  const handleCopySummary = () => {
    const lines = [
      "🧾 *RESUMEN DE CUENTA*",
      `Subtotal: ${formatCurrency(summary.totalBillSubtotal)}`,
      `Impuesto (${taxRate}%): ${formatCurrency(summary.totalTax)}`,
      `Propina (${tipRate}%): ${formatCurrency(summary.totalTip)}`,
      `*TOTAL: ${formatCurrency(summary.grandTotal)}*`,
      "",
      "👥 *A PAGAR POR PERSONA:*",
      ...summary.breakdown.map((p) =>
        p.isInvited
          ? `• ${p.name} (Invitado ✨): $ 0 (Consumo: ${formatCurrency(p.ownTotal)})`
          : `• ${p.name}: *${formatCurrency(p.finalToPay)}*${
              p.guestCoverageShare > 0
                ? ` (Propio: ${formatCurrency(p.ownTotal)} + Invitados: ${formatCurrency(
                    p.guestCoverageShare,
                  )})`
                : ""
            }`,
      ),
    ];

    navigator.clipboard.writeText(lines.join("\n"));
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2500);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      <BillHeader
        grandTotal={summary.grandTotal}
        copiedSummary={copiedSummary}
        onCopySummary={handleCopySummary}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        <PeopleManager
          people={people}
          hostsCount={summary.hostsCount}
          onAddPerson={handleAddPerson}
          onToggleInvited={toggleInvited}
          onRemovePerson={removePerson}
        />

        <ItemsTable
          items={items}
          people={people}
          unassignedAmount={summary.unassignedAmount}
          onAddItem={handleAddItem}
          onUpdateItem={updateItem}
          onTogglePersonInItem={togglePersonInItem}
          onSelectAllForItem={selectAllForItem}
          onRemoveItem={removeItem}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <TaxTipSettings
            taxRate={taxRate}
            tipRate={tipRate}
            guestSplitMode={guestSplitMode}
            summary={summary}
            onChangeTaxRate={setTaxRate}
            onChangeTipRate={setTipRate}
            onChangeGuestSplitMode={setGuestSplitMode}
          />

          <SettlementBreakdown
            breakdown={summary.breakdown}
            copiedSummary={copiedSummary}
            onCopySummary={handleCopySummary}
          />
        </div>
      </main>
    </div>
  );
}
