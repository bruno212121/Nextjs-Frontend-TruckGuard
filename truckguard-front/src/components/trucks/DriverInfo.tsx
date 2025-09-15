"use client";

type DriverLite = { id: number; name: string; surname: string; email?: string };

export default function DriverInfo({ driver }: { driver?: DriverLite | null }) {
  if (!driver) return null;

  return (
    <div className="p-3 bg-slate-700/50 rounded-lg">
      <p className="text-slate-400 text-sm">Conductor asignado</p>
      <p className="text-white font-medium">
        {driver.name} {driver.surname}
      </p>
      {driver.email && <p className="text-slate-300 text-sm">{driver.email}</p>}
    </div>
  );
}
