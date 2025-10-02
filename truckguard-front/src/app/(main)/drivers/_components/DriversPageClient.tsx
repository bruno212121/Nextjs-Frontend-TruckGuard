"use client";

import { useMemo, useState } from "react";
import { Users } from "lucide-react";
import type { Driver } from "@/types/drivers.types";
import type { Truck } from "@/types/trucks.types";
import { assignTruck } from "@/lib/actions/truck.actions";
import DriversStats from "./DriversStats";
import DriversFilters from "./DriversFilters";
import DriverCard from "./DriverCard";
import AssignDialog from "./AssignDialog";

type Props = {
    initialDrivers: Driver[];
    initialTrucks: Truck[];
};

export default function DriversPageClient({ initialDrivers, initialTrucks }: Props) {
    // estado local (UI)
    const [search, setSearch] = useState("");

    const [drivers, setDrivers] = useState(initialDrivers);
    const [trucks, setTrucks] = useState(initialTrucks);

    const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
    const [selectedTruckId, setSelectedTruckId] = useState<string>("");

    const [assignOpen, setAssignOpen] = useState(false);
    const [assigning, setAssigning] = useState(false);
    const [assignError, setAssignError] = useState<string | null>(null);

    // Usar datos reales del backend
    const driversVM = useMemo(() => drivers, [drivers]);

    const filtered = useMemo(() => {
        const term = search.toLowerCase();
        return driversVM.filter((d) => {
            const matchT =
                d.name.toLowerCase().includes(term) ||
                d.surname.toLowerCase().includes(term) ||
                d.email.toLowerCase().includes(term);
            // Todos los conductores sin camión están disponibles, no hay filtro por status
            return matchT;
        });
    }, [driversVM, search]);

    const openAssign = (driver: Driver) => {
        setSelectedDriver(driver);
        setSelectedTruckId("");
        setAssignError(null);
        setAssignOpen(true);
    };

    const confirmAssign = async () => {
        if (!selectedDriver || !selectedTruckId) return;
        try {
            setAssigning(true);
            setAssignError(null);

            await assignTruck(Number(selectedTruckId), selectedDriver.id);

            // Optimistic: removemos el driver de la lista
            setDrivers((prev) => prev.filter((d) => d.id !== selectedDriver.id));
            // Opcional: remover ese truck del combo
            setTrucks((prev) => prev.filter((t) => String(t.truck_id) !== selectedTruckId));

            setAssignOpen(false);
            setSelectedDriver(null);
            setSelectedTruckId("");
        } catch (e: any) {
            setAssignError(e?.message ?? "No se pudo asignar");
        } finally {
            setAssigning(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-slate-900 via-gray-900 to-slate-800 p-4 lg:p-8">
            {/* Header básico */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <Users className="h-8 w-8 text-blue-400" />
                    <h1 className="text-3xl font-bold text-white">Gestión de Conductores</h1>
                </div>
                <p className="text-slate-300">Administra conductores disponibles y asigna camiones</p>
            </div>

            <DriversStats drivers={driversVM} trucks={trucks} />

            <DriversFilters
                search={search}
                onSearch={setSearch}
            />

            {/* Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filtered.map((d) => (
                    <DriverCard key={d.id} driver={d} onAssign={() => openAssign(d)} />
                ))}
            </div>

            {filtered.length === 0 && (
                <div className="text-center py-12">
                    <Users className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-white mb-2">No se encontraron conductores</h3>
                    <p className="text-slate-400">Intenta ajustar los filtros</p>
                </div>
            )}

            <AssignDialog
                open={assignOpen}
                onOpenChange={setAssignOpen}
                driver={selectedDriver}
                trucks={trucks}
                selectedTruckId={selectedTruckId}
                onChangeTruckId={setSelectedTruckId}
                onConfirm={confirmAssign}
                loading={assigning}
                error={assignError}
            />
        </div>
    );
}
