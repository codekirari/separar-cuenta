import { Plus, Check, Trash2, AlertCircle } from "lucide-react";
import { BillItem } from "../models/BillItem";
import { Person } from "../models/Person";
import { formatCurrency } from "../utils/formatCurrency";

export interface ItemsTableProps {
  items: BillItem[];
  people: Person[];
  unassignedAmount: number;
  onAddItem: () => void;
  onUpdateItem: (
    itemId: string,
    field: keyof Omit<BillItem, "id" | "sharedBy">,
    value: string | number,
  ) => void;
  onTogglePersonInItem: (itemId: string, personId: string) => void;
  onSelectAllForItem: (itemId: string) => void;
  onRemoveItem: (itemId: string) => void;
}

export function ItemsTable({
  items,
  people,
  unassignedAmount,
  onAddItem,
  onUpdateItem,
  onTogglePersonInItem,
  onSelectAllForItem,
  onRemoveItem,
}: ItemsTableProps) {
  return (
    <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-slate-900">
            Detalle de Consumos
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Selecciona quiénes compartieron cada producto para dividir su valor.
          </p>
        </div>
        <button
          type="button"
          onClick={onAddItem}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Agregar ítem</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wider">
              <th className="py-3 px-4 min-w-50">
                Producto / Descripción
              </th>
              <th className="py-3 px-3 w-20 text-center">Cant.</th>
              <th className="py-3 px-3 w-32 text-right">Valor Unit.</th>
              <th className="py-3 px-3 w-32 text-right">Total Ítem</th>
              {people.map((person) => (
                <th
                  key={person.id}
                  className={`py-3 px-2 text-center min-w-21 border-l border-slate-200/70 ${
                    person.isInvited ? "bg-amber-50/50 text-amber-900" : ""
                  }`}
                >
                  <div
                    className="truncate max-w-22 mx-auto"
                    title={person.name}
                  >
                    {person.name}
                  </div>
                  {person.isInvited && (
                    <span className="text-[10px] font-normal text-amber-700 block normal-case">
                      Invitado
                    </span>
                  )}
                </th>
              ))}
              <th className="py-3 px-3 w-16 text-center border-l border-slate-200/70">
                Todos
              </th>
              <th className="py-3 px-3 w-12"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {items.map((item) => {
              const lineTotal =
                (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0);
              const allSelected =
                people.length > 0 &&
                people.every((p) => item.sharedBy.includes(p.id));
              const hasNoConsumers =
                item.sharedBy.length === 0 && lineTotal > 0;

              return (
                <tr
                  key={item.id}
                  className={`hover:bg-slate-50/70 transition-colors ${
                    hasNoConsumers ? "bg-rose-50/40" : ""
                  }`}
                >
                  <td className="py-2.5 px-4">
                    <input
                      type="text"
                      placeholder="Ej. Plato fuerte, bebida..."
                      value={item.name}
                      onChange={(e) =>
                        onUpdateItem(item.id, "name", e.target.value)
                      }
                      suppressHydrationWarning
                      className="w-full px-2.5 py-1.5 rounded-lg border border-transparent hover:border-slate-300 focus:border-emerald-500 focus:bg-white focus:outline-none transition-colors"
                    />
                  </td>
                  <td className="py-2.5 px-3">
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) =>
                        onUpdateItem(
                          item.id,
                          "quantity",
                          Math.max(0, Number(e.target.value)),
                        )
                      }
                      suppressHydrationWarning
                      className="w-16 mx-auto block text-center px-2 py-1.5 rounded-lg border border-slate-200 focus:border-emerald-500 focus:outline-none"
                    />
                  </td>
                  <td className="py-2.5 px-3">
                    <input
                      type="number"
                      min={0}
                      step={500}
                      value={item.unitPrice}
                      onChange={(e) =>
                        onUpdateItem(
                          item.id,
                          "unitPrice",
                          Math.max(0, Number(e.target.value)),
                        )
                      }
                      suppressHydrationWarning
                      className="w-28 ml-auto block text-right px-2.5 py-1.5 rounded-lg border border-slate-200 focus:border-emerald-500 focus:outline-none"
                    />
                  </td>
                  <td className="py-2.5 px-3 text-right font-semibold text-slate-800 whitespace-nowrap">
                    {formatCurrency(lineTotal)}
                  </td>

                  {people.map((person) => {
                    const isChecked = item.sharedBy.includes(person.id);
                    return (
                      <td
                        key={person.id}
                        onClick={() => onTogglePersonInItem(item.id, person.id)}
                        className={`py-2.5 px-2 text-center border-l border-slate-100 cursor-pointer select-none transition-colors ${
                          person.isInvited ? "bg-amber-50/25" : ""
                        }`}
                      >
                        <button
                          type="button"
                          aria-label={`Asignar ${item.name} a ${person.name}`}
                          className={`w-7 h-7 rounded-lg inline-flex items-center justify-center transition-all cursor-pointer ${
                            isChecked
                              ? person.isInvited
                                ? "bg-amber-500 text-white shadow-xs"
                                : "bg-emerald-600 text-white shadow-xs"
                              : "bg-slate-100 text-transparent hover:bg-slate-200"
                          }`}
                        >
                          <Check className="w-4 h-4 stroke-[2.5]" />
                        </button>
                      </td>
                    );
                  })}

                  <td className="py-2.5 px-3 text-center border-l border-slate-100">
                    <button
                      type="button"
                      onClick={() => onSelectAllForItem(item.id)}
                      title="Dividir entre todos"
                      className={`px-2 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                        allSelected
                          ? "bg-slate-800 text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      Todos
                    </button>
                  </td>

                  <td className="py-2.5 px-3 text-center">
                    <button
                      type="button"
                      onClick={() => onRemoveItem(item.id)}
                      title="Eliminar ítem"
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {unassignedAmount > 0 && (
        <div className="px-5 py-3 bg-rose-50 border-t border-rose-200 flex items-center gap-2 text-xs text-rose-700">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>
            Hay <strong>{formatCurrency(unassignedAmount)}</strong> sin asignar
            a ninguna persona. Marca al menos una casilla en cada fila.
          </span>
        </div>
      )}
    </section>
  );
}