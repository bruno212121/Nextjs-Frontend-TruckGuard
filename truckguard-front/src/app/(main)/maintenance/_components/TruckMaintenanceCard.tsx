"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Truck as TruckIcon, User, Calendar, Gauge, Wrench } from "lucide-react";
import type { Truck, TruckComponentsStatusResponse, ComponentStatus } from "@/types/trucks.types";
import { useMemo, useState } from "react";
import CreateMaintenanceModal from "./CreateMaintenanceModal";

export default function TruckMaintenanceCard({
    truck,
    componentsData,
    onMaintenanceCreated
}: {
    truck: Truck;
    componentsData?: TruckComponentsStatusResponse;
    onMaintenanceCreated?: () => void;
}) {
    const [selectedComponent, setSelectedComponent] = useState<ComponentStatus | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const ATTENTION: Array<ComponentStatus["current_status"]> = [
        "Maintenance Required",
        "Fair",
        "Good",
        "Very Good",
    ];

    const componentsNeedingAttention = useMemo<ComponentStatus[]>(() => {
        const comps = componentsData?.components ?? [];
        return comps.filter(c => ATTENTION.includes(c.current_status));
    }, [componentsData]);

    const badgeClassFor = (status: ComponentStatus["current_status"]) => {
        switch (status) {
            case "Maintenance Required":
                return "bg-red-600 text-white";
            case "Fair":
                return "bg-yellow-600 text-white";
            case "Good":
                return "bg-orange-600 text-white";
            case "Very Good":
                return "bg-green-600 text-white";
            default:
                return "bg-slate-600 text-white";
        }
    };

    const barClassFor = (status: ComponentStatus["current_status"]) => {
        switch (status) {
            case "Maintenance Required":
                return "bg-red-500";
            case "Fair":
                return "bg-yellow-500";
            case "Good":
                return "bg-orange-500";
            case "Very Good":
                return "bg-green-500";
            default:
                return "bg-slate-500";
        }
    };
    return (
        <>
            <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors">
                <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-xl text-white">{truck.plate}</CardTitle>
                            <p className="text-slate-300">{truck.brand} {truck.model} ({truck.year})</p>
                        </div>
                        <TruckIcon className="h-8 w-8 text-slate-400" />
                    </div>
                </CardHeader>

                <CardContent className="space-y-4">
                    {/* Información básica del camión */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 text-sm text-slate-300">
                            <Gauge className="h-4 w-4 shrink-0" />
                            <div>
                                <p className="text-slate-400">Kilometraje</p>
                                <p className="text-white font-medium">{truck.mileage.toLocaleString()} km</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 text-sm text-slate-300">
                            <Calendar className="h-4 w-4 shrink-0" />
                            <div>
                                <p className="text-slate-400">Estado</p>
                                <Badge className="bg-blue-600 text-white text-xs">
                                    {truck.status}
                                </Badge>
                            </div>
                        </div>
                    </div>

                    {/* Información del conductor */}
                    {truck.driver ? (
                        <div className="flex items-center gap-3 text-sm text-slate-300 p-3 bg-slate-700/50 rounded-lg">
                            <User className="h-4 w-4 shrink-0" />
                            <div>
                                <p className="text-slate-400">Conductor asignado</p>
                                <p className="text-white font-medium">{truck.driver.name} {truck.driver.surname}</p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3 text-sm text-slate-300 p-3 bg-slate-700/50 rounded-lg">
                            <User className="h-4 w-4 shrink-0" />
                            <div>
                                <p className="text-slate-400">Sin conductor asignado</p>
                                <p className="text-orange-400 font-medium">Disponible</p>
                            </div>
                        </div>
                    )}

                    {/* Componentes con estado crítico o a atender */}
                    <div className="space-y-3">
                        <p className="text-slate-300 text-sm">Componentes que requieren atención:</p>
                        {componentsData === undefined && (
                            <div className="text-sm text-slate-400">Sin datos de componentes.</div>
                        )}
                        {componentsData && componentsNeedingAttention.length === 0 && (
                            <div className="text-sm text-slate-400">Sin componentes con estado crítico.</div>
                        )}
                        {componentsNeedingAttention.map((c) => (
                            <div key={c.component_name} className="p-3 bg-slate-700/50 rounded-lg border border-slate-600">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="text-white font-medium">{c.component_name}</span>
                                        <Badge className={badgeClassFor(c.current_status)}>
                                            {c.current_status}
                                        </Badge>
                                    </div>
                                    <span className="text-orange-400 font-bold">{Math.max(0, 100 - c.health_percentage)}%</span>
                                </div>
                                <div className="mt-2 h-2 w-full rounded bg-slate-600">
                                    <div className={`h-2 rounded ${barClassFor(c.current_status)}`} style={{ width: `${Math.min(100, Math.max(0, 100 - c.health_percentage))}%` }} />
                                </div>
                                <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-slate-300">
                                    <div>
                                        <p className="text-slate-400">Último mantenimiento.</p>
                                        <p className="text-white">{c.last_maintenance_mileage.toLocaleString()} km</p>
                                    </div>
                                    <div>
                                        <p className="text-slate-400">Próximo mantenimiento.</p>
                                        <p className="text-white">{c.next_maintenance_mileage.toLocaleString()} km</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => {
                                        setSelectedComponent(c);
                                        setIsModalOpen(true);
                                    }}
                                    className="mt-3 w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
                                >
                                    <Wrench className="h-4 w-4" />
                                    Crear Mantenimiento
                                </button>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {selectedComponent && (
                <CreateMaintenanceModal
                    isOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false);
                        setSelectedComponent(null);
                    }}
                    truck={truck}
                    component={selectedComponent}
                    onSuccess={() => {
                        // Llamar el callback para actualizar la página
                        if (onMaintenanceCreated) {
                            onMaintenanceCreated();
                        }
                    }}
                />
            )}
        </>
    );
}
