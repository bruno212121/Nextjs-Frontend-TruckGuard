import { notFound } from "next/navigation";
import { getTruck, getTruckCurrentComponents, getTruckComponentsHistory, getTruckMaintenanceHistory } from "@/lib/actions/truck.actions";
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

    // 1) Traer el camión, componentes actuales, historial de componentes y historial de mantenimiento
    const [{ truck }, currentComponentsResponse, componentsHistoryResponse, maintenanceHistoryResponse] = await Promise.all([
        getTruck(id),
        getTruckCurrentComponents(id).catch(() => ({
            truck_id: id,
            components: []
        })), // Fallback si falla
        getTruckComponentsHistory(id).catch(() => ({
            truck_id: id,
            maintenance_history: []
        })), // Fallback si falla
        getTruckMaintenanceHistory(id).catch(() => ({
            maintenances: []
        })) // Fallback si falla
    ]);

    if (!truck) notFound();

    // Log de depuración
    console.log("🔍 DEBUG - Datos en TruckDetailPage:");
    console.log("- Camión:", truck);
    console.log("- Componentes actuales:", currentComponentsResponse);
    console.log("- Historial de componentes:", componentsHistoryResponse);
    console.log("- Historial de mantenimiento:", maintenanceHistoryResponse);

    // 2) Derivar datos que usa la UI
    const driverName =
        truck.driver ? `${truck.driver.name} ${truck.driver.surname}` : "—";

    // Salud: calcular basado en los componentes actuales
    const healthScore = (() => {
        if (currentComponentsResponse.components.length === 0) return 85;

        // Mapear estados a números (escala ampliada para mejor visualización)
        const statusMap: Record<string, number> = {
            "Excellent": 100,
            "Very Good": 85,
            "Good": 50,
            "Fair": 30,
            "Maintenance Required": 25,
        };

        // Calcular promedio de salud de todos los componentes
        const totalScore = currentComponentsResponse.components.reduce((sum: number, component: any) => {
            return sum + (statusMap[component.status] || 80);
        }, 0);

        return Math.round(totalScore / currentComponentsResponse.components.length);
    })();

    // Radar: usar datos reales de componentes actuales del backend
    const radarData = currentComponentsResponse.components.length > 0
        ? currentComponentsResponse.components.map((component: any) => {
            // Mapear estado a porcentaje para el radar (escala ampliada)
            const statusMap: Record<string, number> = {
                "Excellent": 100,
                "Very Good": 85,
                "Good": 50,
                "Fair": 30,
                "Maintenance Required": 25,
            };

            return {
                label: component.component_name,
                value: statusMap[component.status] || 80,
            };
        })
        : [
            // Datos de fallback si no hay componentes
            { label: "Filtros", value: 90 },
            { label: "Aceite", value: 80 },
            { label: "Frenos", value: 95 },
            { label: "Neumático", value: 75 },
            { label: "Inyectores", value: 70 },
        ];

    // Historial de componentes (mantenimientos realizados): usar datos del nuevo endpoint
    const componentsHistory = componentsHistoryResponse.maintenance_history?.map((h: any) => ({
        id: h.maintenance_id,
        component: h.component_name,
        status: h.status,
        cost: h.cost,
        date: h.created_at,
        description: `Mantenimiento de ${h.component_name}`,
    })) || [];

    // Combinar historial de mantenimientos y historial de componentes
    const allMaintenanceHistory = [
        // Historial de mantenimientos tradicional
        ...maintenanceHistoryResponse.maintenances.map((m) => ({
            id: m.maintenance_id,
            title: m.description || `${m.component} - Mantenimiento`,
            date: m.updated_at || m.created_at,
            status: (m.status === "Maintenance Required" ? "Programado" : "Completado") as "Programado" | "Completado",
            cost: m.cost,
            type: "maintenance" as const,
        })),
        // Historial de componentes (mantenimientos realizados)
        ...(componentsHistoryResponse.maintenance_history || []).map((h: any) => ({
            id: h.maintenance_id,
            title: `Mantenimiento de ${h.component_name}`,
            date: h.created_at,
            status: "Completado" as "Programado" | "Completado",
            cost: h.cost,
            type: "component" as const,
        }))
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Ordenar por fecha más reciente


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
                        <MaintenanceHistory items={allMaintenanceHistory} />
                    </Card>
                </div>
            </div>
        </main>
    );
}

