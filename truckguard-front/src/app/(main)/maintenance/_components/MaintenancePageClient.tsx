"use client";

import { useMemo, useState } from "react";
import { Wrench } from "lucide-react";
import MaintenanceStats from "./MaintenanceStats";
import MaintenanceFilters from "./MaintenanceFilters";
import TruckMaintenanceCard from "./TruckMaintenanceCard";
import type { Truck } from "@/types/trucks.types";

export default function MaintenancePageClient({ initialTrucks }: { initialTrucks: Truck[] }) {
    const [searchTerm, setSearch] = useState("");

    const filtered = useMemo(() => {
        return initialTrucks.filter(truck => {
            const s = searchTerm.toLowerCase();
            return truck.plate.toLowerCase().includes(s) ||
                truck.brand.toLowerCase().includes(s) ||
                truck.model.toLowerCase().includes(s);
        });
    }, [initialTrucks, searchTerm]);

    // KPIs simplificados basados en datos reales
    const kpis = useMemo(() => {
        const trucks = initialTrucks.length;
        const trucksWithDriver = initialTrucks.filter(t => t.driver).length;
        const trucksWithoutDriver = trucks - trucksWithDriver;

        return {
            totalTrucks: trucks,
            trucksWithDriver,
            trucksWithoutDriver,
            totalComponents: 0 // No disponible en backend
        };
    }, [initialTrucks]);

    return (
        <div className="min-h-screen bg-gradient-to-r from-slate-900 via-gray-900 to-slate-800 p-4 lg:p-8">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <Wrench className="h-8 w-8 text-orange-400" />
                    <h1 className="text-3xl font-bold text-white">Gestión de Mantenimiento</h1>
                </div>
                <p className="text-slate-300">Monitorea el estado de los camiones y sus componentes</p>
            </div>

            <MaintenanceStats kpis={kpis} />

            <MaintenanceFilters
                search={searchTerm}
                onSearch={setSearch}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filtered.map(truck => (
                    <TruckMaintenanceCard key={truck.truck_id} truck={truck} />
                ))}
            </div>

            {filtered.length === 0 && (
                <div className="text-center py-12">
                    <Wrench className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-white mb-2">No se encontraron camiones</h3>
                    <p className="text-slate-400">Intenta ajustar los filtros de búsqueda</p>
                </div>
            )}
        </div>
    );
}
