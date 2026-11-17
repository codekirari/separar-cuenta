import { Users, UserPlus, Sparkles, Trash2, AlertCircle } from "lucide-react";
import { useState } from "react";
import { Person } from "../models/Person";

export interface PeopleManagerProps {
  people: Person[];
  hostsCount: number;
  onAddPerson: (name: string) => void;
  onToggleInvited: (personId: string) => void;
  onRemovePerson: (personId: string) => void;
}

export function PeopleManager({
  people,
  hostsCount,
  onAddPerson,
  onToggleInvited,
  onRemovePerson,
}: PeopleManagerProps) {
  const [newPersonName, setNewPersonName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newPersonName.trim();
    if (!trimmed) return;
    onAddPerson(trimmed);
    setNewPersonName("");
  };

  return (
    <section className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-600" />
            Personas en la mesa ({people.length})
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Marca como{" "}
            <span className="font-medium text-amber-700">Invitado</span> a
            quienes no pagan; su consumo se repartirá entre los demás.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            placeholder="Nombre (ej. Pilar)"
            value={newPersonName}
            onChange={(e) => setNewPersonName(e.target.value)}
            suppressHydrationWarning
            className="px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 w-44 sm:w-52"
          />
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700 transition-colors cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Agregar</span>
          </button>
        </form>
      </div>

      <div className="flex flex-wrap gap-2.5">
        {people.map((person) => (
          <div
            key={person.id}
            className={`flex items-center gap-2 pl-3.5 pr-2 py-1.5 rounded-xl border text-sm transition-all ${
              person.isInvited
                ? "bg-amber-50/80 border-amber-300 text-amber-950"
                : "bg-slate-50 border-slate-200 text-slate-800"
            }`}
          >
            <span className="font-medium">{person.name}</span>

            <button
              type="button"
              onClick={() => onToggleInvited(person.id)}
              title={
                person.isInvited
                  ? "Quitar estado de invitado"
                  : "Marcar como invitado (no paga)"
              }
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                person.isInvited
                  ? "bg-amber-500 text-white shadow-xs"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
              }`}
            >
              <Sparkles className="w-3 h-3" />
              {person.isInvited ? "Invitado" : "Paga"}
            </button>

            {people.length > 1 && (
              <button
                type="button"
                onClick={() => onRemovePerson(person.id)}
                title="Eliminar persona"
                className="p-1 text-slate-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        ))}
      </div>

      {hostsCount === 0 && (
        <div className="mt-3 flex items-center gap-2 text-xs text-rose-700 bg-rose-50 border border-rose-200 px-3 py-2 rounded-xl">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>
            Todos están marcados como invitados. Debe haber al menos una persona
            que pague la cuenta.
          </span>
        </div>
      )}
    </section>
  );
}
