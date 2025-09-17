"use client";

export default function TruckSummary({
  brand,
  model,
  year,
  plate,
  color,
  mileage,
  driverName,
  driverPhone,
}: {
  brand: string;
  model: string;
  year: string;
  plate: string;
  color: string;
  mileage: number;
  driverName: string;
  driverPhone?: string;
}) {
  return (
    <div className="rounded-lg bg-slate-900/40 border border-slate-700 p-6">
      <h2 className="text-xl text-white font-semibold mb-6">
        Detalles del Camión
      </h2>
      <div className="grid md:grid-cols-3 gap-8">
        <Field label="Marca" value={brand} />
        <Field label="Conductor" value={driverName} />
        <Field label="Kilometraje" value={mileage.toLocaleString()} suffix=" km" />

        <Field label="Modelo" value={model} />
        <Field label="Placa" value={plate} />
        <Field label="Puntuación de Salud" value="" custom={<ScorePill value="85%" />} />

        <Field label="Año" value={year} />
        <Field label="Color" value={color} />
        <Field
          label=""
          value=""
          custom={
            driverPhone ? (
              <a
                href={`tel:${driverPhone}`}
                className="inline-flex items-center gap-2 text-slate-200 bg-slate-800 border border-slate-600 rounded-md px-3 py-2 text-sm"
              >
                <span className="i-lucide-phone h-4 w-4" />
                {driverPhone}
              </a>
            ) : (
              <span className="text-slate-500">—</span>
            )
          }
        />
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  suffix,
  custom,
}: {
  label: string;
  value: string | number;
  suffix?: string;
  custom?: React.ReactNode;
}) {
  return (
    <div>
      {label && <p className="text-slate-400 text-sm">{label}</p>}
      {custom ? (
        <div className="mt-1">{custom}</div>
      ) : (
        <p className="text-white text-xl font-semibold mt-1">
          {value}
          {suffix}
        </p>
      )}
    </div>
  );
}

function ScorePill({ value }: { value: string }) {
  return (
    <span className="inline-flex items-center font-semibold text-emerald-400 bg-emerald-900/20 px-2 py-1 rounded-md">
      {value}
    </span>
  );
}
