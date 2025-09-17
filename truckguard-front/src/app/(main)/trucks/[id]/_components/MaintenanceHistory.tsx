"use client";

import { Badge } from "@/components/ui/badge";
import { CalendarDays, CheckCircle2, Clock3 } from "lucide-react";

type Item = {
  id: number | string;
  title: string;
  date?: string;
  status: "Completado" | "Programado";
  cost?: number;
};

export default function MaintenanceHistory({ items }: { items: Item[] }) {
  if (!items || items.length === 0) {
    return <p className="text-slate-400">Sin registros de mantenimiento.</p>;
  }

  return (
    <div className="space-y-3">
      {items.map((it) => (
        <div
          key={it.id}
          className="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-900/40 p-4"
        >
          <div className="flex items-center gap-3">
            {it.status === "Completado" ? (
              <CheckCircle2 className="text-emerald-400 h-5 w-5" />
            ) : (
              <Clock3 className="text-amber-400 h-5 w-5" />
            )}
            <div>
              <p className="text-white font-medium">{it.title}</p>
              {it.date && (
                <p className="text-slate-400 text-sm flex items-center gap-1 mt-0.5">
                  <CalendarDays className="h-4 w-4" />
                  {new Date(it.date).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {typeof it.cost === "number" && (
              <span className="text-slate-200 font-semibold">
                €{it.cost.toLocaleString()}
              </span>
            )}
            <Badge
              className={
                it.status === "Completado"
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-amber-100 text-amber-800"
              }
            >
              {it.status}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  );
}
