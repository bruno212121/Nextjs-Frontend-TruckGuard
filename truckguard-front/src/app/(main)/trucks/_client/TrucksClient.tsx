// src/app/(main)/trucks/_client/TrucksClient.tsx
"use client";

import { useMemo, useState } from "react";
import type { Truck, Driver } from "@/types/trucks.types";
import { assignTruck, editTruck, unassignTruck } from "@/lib/actions/truck.actions";
import TruckCard from "@/components/trucks/TruckCard";
import FiltersBar from "@/components/trucks/FiltersBar";
import { useRouter } from "next/navigation";



type Props = {
  initialTrucks: Truck[];
  initialAvailableDrivers: Driver[];
};

export default function TrucksClient({
  initialTrucks,
  initialAvailableDrivers,
}: Props) {
  const router = useRouter();
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
      setDrivers((ds) => ds.filter((d) => d.id !== driver_id));
    } catch (e) {
      console.error("assignDriver error:", e);
      setTrucks(prev);
    }
  };

  const handleNavigateToCreate = () => {
    router.push("/trucks/create");
  };

  const handleRemoveDriver = async (truck_id: number) => {
    const truck = trucks.find(t => t.truck_id === truck_id);
    if (!truck?.driver) return;

    const prev = [...trucks];
    setTrucks((curr) =>
      curr.map((t) => (t.truck_id === truck_id ? { ...t, driver: null } : t))
    );

    try {
      await unassignTruck(truck_id);
      // Agregar el conductor de vuelta a la lista de disponibles
      if (truck.driver) {
        setDrivers((ds) => [...ds, truck.driver!]);
      }
    } catch (e) {
      setTrucks(prev);
      console.error("removeDriver error:", e);
    }
  };

  const handleNavigateToDetails = (truck_id: number) => {
    router.push(`/trucks/${truck_id}`);
  };

  // ---- Render mínimo (temporal) ----
  return (
    <div className="p-6 h-full space-y-6 bg-gradient-to-r from-slate-900 via-gray-900 to-slate-800">
      <FiltersBar
        search={search}
        onSearch={setSearch}
        status={statusFilter}
        onStatusChange={setStatusFilter}
        onCreate={handleNavigateToCreate}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((t) => (
          <TruckCard
            key={t.truck_id}
            truck={t}
            availableDrivers={drivers}
            onChangeStatus={handleUpdateStatus}
            onAssignDriver={handleAssignDriver}
            onRemoveDriver={handleRemoveDriver}
            onNavigateToDetails={handleNavigateToDetails}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-slate-400">No se encontraron camiones.</div>
      )}
    </div>
  );
}