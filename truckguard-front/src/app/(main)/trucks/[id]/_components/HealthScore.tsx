"use client";

export default function HealthScore({ score }: { score: number }) {
  return (
    <div className="rounded-lg bg-slate-900/40 border border-slate-700 p-6 h-full">
      <p className="text-slate-400 text-sm">Puntuación de Salud</p>
      <p className="text-4xl text-emerald-400 font-bold mt-2">{score}%</p>
      <p className="text-slate-400 text-sm mt-2">
        Estimación general basada en el estado de componentes.
      </p>
    </div>
  );
}
