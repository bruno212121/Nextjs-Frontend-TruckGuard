import { notFound } from "next/navigation";
import { getTruck, getTruckComponentsStatus, getTruckMaintenanceHistory } from "@/lib/actions/truck.actions";
import { Card } from "@/components/ui/card";

import TruckHeader from "./_components/TruckHeader";
import TruckSummary from "./_components/TruckSummary";
import HealthScore from "./_components/HealthScore";
import ComponentsRadar from "./_components/ComponentsRadar";
import MaintenanceHistory from "./_components/MaintenanceHistory";


type Props = { params: { id: string } };

export default async function TruckDetailPage({ params }: Props) {
    const id = Number(params.id);
    if (Number.isNaN(id)) notFound();

    // 1) Traer el camión, estado de componentes y historial de mantenimiento
    const [{ truck }, componentsStatusResponse, maintenanceHistoryResponse] = await Promise.all([
        getTruck(id),
        getTruckComponentsStatus(id).catch(() => ({
            components: [],
            overall_health_status: "Good",
            total_components: 0,
            components_requiring_maintenance: 0
        })), // Fallback si falla
        getTruckMaintenanceHistory(id).catch(() => ({
            maintenances: []
        })) // Fallback si falla
    ]);

    if (!truck) notFound();

    // 2) Derivar datos que usa la UI
    const driverName =
        truck.driver ? `${truck.driver.name} ${truck.driver.surname}` : "—";

    // Salud: usar el estado general del endpoint de componentes o fallback
    const healthScore = (() => {
        const map: Record<string, number> = {
            Excellent: 95,
            "Very Good": 90,
            Good: 85,
            Fair: 70,
            Poor: 50,
            Critical: 30,
            "Maintenance Required": 65,
        };
        // Usar el overall_health_status del endpoint de componentes
        return map[componentsStatusResponse.overall_health_status as keyof typeof map] ?? 85;
    })();

    // Radar: usar datos reales de componentes del backend con health_percentage
    const radarData = componentsStatusResponse.components.length > 0
        ? componentsStatusResponse.components.map((component) => ({
            label: component.component_name,
            value: component.health_percentage, // Usar directamente el porcentaje de salud
        }))
        : [
            // Datos de fallback si no hay componentes
            { label: "Filtros", value: 90 },
            { label: "Aceite", value: 80 },
            { label: "Frenos", value: 95 },
            { label: "Neumático", value: 75 },
            { label: "Inyectores", value: 70 },
        ];

    // Historial de mantenimiento: usar datos reales del backend
    const maintenance = maintenanceHistoryResponse.maintenances.map((m) => ({
        id: m.maintenance_id,
        title: m.description || `${m.component} - Mantenimiento`,
        date: m.updated_at || m.created_at,
        status: (m.status === "Maintenance Required" ? "Programado" : "Completado") as "Programado" | "Completado",
        cost: m.cost,
    }));

    return (
        <main className="flex-1 overflow-auto p-6 bg-gradient-to-r from-slate-900 via-gray-900 to-slate-800 min-h-screen">
            <div className="max-w-6xl mx-auto space-y-6">
                <TruckHeader
                    plate={truck.plate}
                    status={truck.status}
                    subtitle={`Detalles completos del vehículo ${truck.plate}`}
                />

                <Card className="bg-slate-800/50 border-slate-700 p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2">
                            <TruckSummary
                                brand={truck.brand}
                                model={truck.model}
                                year={truck.year}
                                plate={truck.plate}
                                color={truck.color}
                                mileage={truck.mileage}
                                driverName={driverName}
                                driverPhone={truck.driver?.phone}
                            />
                        </div>
                        <div className="space-y-4">
                            <HealthScore score={healthScore} />
                        </div>
                    </div>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="bg-slate-800/50 border-slate-700 p-6">
                        <h3 className="text-xl font-semibold text-white mb-4">
                            Estado de Componentes
                        </h3>
                        <ComponentsRadar data={radarData} />
                    </Card>

                    <Card className="bg-slate-800/50 border-slate-700 p-6">
                        <h3 className="text-xl font-semibold text-white mb-4">
                            Historial de Mantenimiento
                        </h3>
                        <MaintenanceHistory items={maintenance} />
                    </Card>
                </div>
            </div>
        </main>
    );
}

