import { Receipt, Check, Copy } from "lucide-react";
import { formatCurrency } from "../utils/formatCurrency";

export interface BillHeaderProps {
  grandTotal: number;
  copiedSummary: boolean;
  onCopySummary: () => void;
}

export function BillHeader({
  grandTotal,
  copiedSummary,
  onCopySummary,
}: BillHeaderProps) {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="bg-emerald-600 text-white p-2 rounded-xl shadow-sm">
            <Receipt className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-slate-900">
              División de Cuenta
            </h1>
            <p className="text-xs text-slate-500 hidden sm:block">
              Reparto inteligente con soporte para invitados
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-xs text-slate-500 block">Total Cuenta</span>
            <span className="text-base sm:text-lg font-bold text-emerald-700">
              {formatCurrency(grandTotal)}
            </span>
          </div>
          <button
            type="button"
            onClick={onCopySummary}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium bg-slate-900 text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            {copiedSummary ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Copiado</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span className="hidden sm:inline">Copiar resumen</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}