import { Percent } from "lucide-react";
import { BillSummary } from "../models/BillSummary";
import { formatCurrency } from "../utils/formatCurrency";

export interface TaxTipSettingsProps {
  taxRate: number;
  tipRate: number;
  guestSplitMode: "equal" | "proportional";
  summary: BillSummary;
  onChangeTaxRate: (rate: number) => void;
  onChangeTipRate: (rate: number) => void;
  onChangeGuestSplitMode: (mode: "equal" | "proportional") => void;
}

export function TaxTipSettings({
  taxRate,
  tipRate,
  guestSplitMode,
  summary,
  onChangeTaxRate,
  onChangeTipRate,
  onChangeGuestSplitMode,
}: TaxTipSettingsProps) {
  return (
    <section className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-5 self-start">
      <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
        <Percent className="w-4 h-4 text-emerald-600" />
        Impuestos, Propina y Reglas
      </h2>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1.5">
            Impuesto / INC (%)
          </label>
          <div className="relative">
            <input
              type="number"
              min={0}
              max={100}
              step={1}
              value={taxRate}
              onChange={(e) =>
                onChangeTaxRate(Math.max(0, Number(e.target.value)))
              }
              suppressHydrationWarning
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <span className="absolute right-3 top-2 text-sm text-slate-400">
              %
            </span>
          </div>
          <div className="flex gap-1.5 mt-1.5">
            {[0, 8, 19].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => onChangeTaxRate(preset)}
                className={`px-2 py-0.5 text-xs rounded-md border cursor-pointer ${
                  taxRate === preset
                    ? "bg-emerald-50 border-emerald-300 text-emerald-700 font-medium"
                    : "border-slate-200 text-slate-500 hover:bg-slate-50"
                }`}
              >
                {preset}%
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1.5">
            Propina / Servicio (%)
          </label>
          <div className="relative">
            <input
              type="number"
              min={0}
              max={100}
              step={1}
              value={tipRate}
              onChange={(e) =>
                onChangeTipRate(Math.max(0, Number(e.target.value)))
              }
              suppressHydrationWarning
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <span className="absolute right-3 top-2 text-sm text-slate-400">
              %
            </span>
          </div>
          <div className="flex gap-1.5 mt-1.5">
            {[0, 10, 15].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => onChangeTipRate(preset)}
                className={`px-2 py-0.5 text-xs rounded-md border cursor-pointer ${
                  tipRate === preset
                    ? "bg-emerald-50 border-emerald-300 text-emerald-700 font-medium"
                    : "border-slate-200 text-slate-500 hover:bg-slate-50"
                }`}
              >
                {preset}%
              </button>
            ))}
          </div>
        </div>
      </div>

      {summary.guestsCount > 0 && (
        <div className="pt-3 border-t border-slate-100">
          <label className="block text-xs font-medium text-slate-700 mb-2">
            ¿Cómo repartir el consumo de los invitados (
            {formatCurrency(summary.totalGuestsCost)})?
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onChangeGuestSplitMode("equal")}
              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                guestSplitMode === "equal"
                  ? "bg-emerald-50 border-emerald-400 text-emerald-950"
                  : "border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              <div className="text-xs font-semibold">Partes iguales</div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                Mismo monto extra por anfitrión
              </div>
            </button>
            <button
              type="button"
              onClick={() => onChangeGuestSplitMode("proportional")}
              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                guestSplitMode === "proportional"
                  ? "bg-emerald-50 border-emerald-400 text-emerald-950"
                  : "border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              <div className="text-xs font-semibold">Proporcional</div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                Según lo que consumió cada uno
              </div>
            </button>
          </div>
        </div>
      )}

      <div className="pt-4 border-t border-slate-200 space-y-2 text-sm">
        <div className="flex justify-between text-slate-600">
          <span>Subtotal consumos</span>
          <span className="font-medium">
            {formatCurrency(summary.totalBillSubtotal)}
          </span>
        </div>
        <div className="flex justify-between text-slate-600">
          <span>Impuesto ({taxRate}%)</span>
          <span className="font-medium">
            {formatCurrency(summary.totalTax)}
          </span>
        </div>
        <div className="flex justify-between text-slate-600">
          <span>Propina ({tipRate}%)</span>
          <span className="font-medium">
            {formatCurrency(summary.totalTip)}
          </span>
        </div>
        <div className="flex justify-between text-base font-bold text-slate-900 pt-2 border-t border-slate-200">
          <span>Total General</span>
          <span className="text-emerald-700">
            {formatCurrency(summary.grandTotal)}
          </span>
        </div>
      </div>
    </section>
  );
}