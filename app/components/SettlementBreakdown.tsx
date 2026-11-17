import { Calculator, Share2, Sparkles } from "lucide-react";
import { PersonBreakdown } from "../models/PersonBreakdown";
import { formatCurrency } from "../utils/formatCurrency";

export interface SettlementBreakdownProps {
  breakdown: PersonBreakdown[];
  copiedSummary: boolean;
  onCopySummary: () => void;
}

export function SettlementBreakdown({
  breakdown,
  copiedSummary,
  onCopySummary,
}: SettlementBreakdownProps) {
  return (
    <section className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
          <Calculator className="w-4 h-4 text-emerald-600" />
          Liquidación por Persona
        </h2>
        <button
          type="button"
          onClick={onCopySummary}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 hover:text-emerald-800 cursor-pointer"
        >
          <Share2 className="w-3.5 h-3.5" />
          {copiedSummary
            ? "¡Copiado al portapapeles!"
            : "Compartir por WhatsApp"}
        </button>
      </div>

      <div className="space-y-3">
        {breakdown.map((person) => (
          <div
            key={person.id}
            className={`p-4 rounded-xl border transition-all ${
              person.isInvited
                ? "bg-amber-50/60 border-amber-200"
                : "bg-slate-50/70 border-slate-200"
            }`}
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-900">
                    {person.name}
                  </span>
                  {person.isInvited && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-200/80 text-amber-900">
                      <Sparkles className="w-3 h-3" />
                      Invitado
                    </span>
                  )}
                </div>
                <div className="text-xs text-slate-500 mt-1 flex flex-wrap gap-x-3 gap-y-1">
                  <span>Consumo: {formatCurrency(person.ownSubtotal)}</span>
                  <span>
                    Imp/Prop: {formatCurrency(person.ownTax + person.ownTip)}
                  </span>
                  {!person.isInvited && person.guestCoverageShare > 0 && (
                    <span className="text-amber-700 font-medium">
                      + Invitados: {formatCurrency(person.guestCoverageShare)}
                    </span>
                  )}
                  {person.isInvited && (
                    <span className="text-amber-800">
                      Cubierto por los anfitriones (
                      {formatCurrency(person.ownTotal)})
                    </span>
                  )}
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[11px] uppercase tracking-wider text-slate-400 block">
                  Total a pagar
                </span>
                <span
                  className={`text-lg font-bold ${
                    person.isInvited ? "text-amber-700" : "text-emerald-700"
                  }`}
                >
                  {formatCurrency(person.finalToPay)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
