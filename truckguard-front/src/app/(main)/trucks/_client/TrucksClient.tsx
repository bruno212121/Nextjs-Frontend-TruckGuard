// src/app/(main)/trucks/_client/TrucksClient.tsx
"use client";

import { useMemo, useState } from "react";
import type { Truck, Driver } from "@/types/trucks.types";
import { assignTruck, editTruck, createTruck } from "@/lib/actions/truck.actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import TruckCard from "@/components/trucks/TruckCard";
import FiltersBar from "@/components/trucks/FiltersBar";

type Props = {
  initialTrucks: Truck[];
  initialAvailableDrivers: Driver[];
};

export default function TrucksClient({
  initialTrucks,
  initialAvailableDrivers,
}: Props) {
  const [trucks, setTrucks] = useState<Truck[]>(initialTrucks);
  const [drivers, setDrivers] = useState<Driver[]>(initialAvailableDrivers);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "Activo" | "Mantenimiento" | "Inactivo">("all");

  // Filtro básico (lo iremos moviendo a <FiltersBar />)
  const filtered = useMemo(() => {
    const s = search.toLowerCase();
    return trucks.filter((t) => {
      const matchesText =
        t.plate.toLowerCase().includes(s) ||
        t.brand.toLowerCase().includes(s) ||
        t.model.toLowerCase().includes(s);
      const matchesStatus = statusFilter === "all" || t.status === statusFilter;
      return matchesText && matchesStatus;
    });
  }, [trucks, search, statusFilter]);

  // Handlers (optimistas). Luego los pasaremos como props a componentes presentacionales.
  const handleUpdateStatus = async (truck_id: number, status: Truck["status"]) => {
    const prev = [...trucks];
    setTrucks((curr) => curr.map((t) => (t.truck_id === truck_id ? { ...t, status } : t)));
    try {
      await editTruck(truck_id, { status });
    } catch (e) {
      setTrucks(prev); // rollback
      console.error("editTruck error:", e);
    }
  };

  const handleAssignDriver = async (truck_id: number, driver_id: number) => {
    const driver = drivers.find((d) => d.id === driver_id);
    if (!driver) return;

    const prev = [...trucks];
    setTrucks((curr) =>
      curr.map((t) => (t.truck_id === truck_id ? { ...t, driver } : t))
    );
    try {
      await assignTruck(truck_id, driver_id);
      // opcional: remover de la lista de disponibles
      setDrivers((ds) => ds.filter((d) => d.id !== driver_id));
    } catch (e) {
      setTrucks(prev);
      console.error("assignDriver error:", e);
    }
  };

  const handleCreateTruck = async () => {
    // DEMO mínima: crea un camión con datos fijos (luego lo movemos a <CreateTruckSheet />)
    const payload = {
      plate: `TEMP-${Math.floor(Math.random() * 10000)}`,
      brand: "Marca",
      model: "Modelo",
      year: "2024",
      color: "Blanco",
      mileage: 0,
      status: "Activo" as const,
    };
    try {
      const res = await createTruck(payload as any);
      const created = (res.trucks ?? res) as Truck; // depende de tu API
      setTrucks((curr) => [...curr, created]);
    } catch (e) {
      console.error("createTruck error:", e);
    }
  };

  // ---- Render mínimo (temporal) ----
  return (
    <div className="p-6 h-screen space-y-6 bg-gradient-to-r from-slate-900 via-gray-900 to-slate-800">
      <FiltersBar
        search={search}
        onSearch={setSearch}
        status={statusFilter}
        onStatusChange={setStatusFilter}
        onCreate={handleCreateTruck}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((t) => (
          <TruckCard
            key={t.truck_id}
            truck={t}
            availableDrivers={drivers}
            onChangeStatus={handleUpdateStatus}
            onAssignDriver={handleAssignDriver}
          	/>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-slate-400">No se encontraron camiones.</div>
      )}
    </div>
  );
}