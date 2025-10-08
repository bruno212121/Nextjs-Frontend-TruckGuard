
import { getTrucks } from "@/lib/actions/truck.actions";
import { getBulkComponentsStatus } from "@/lib/actions/components.actions";
import type { TruckComponentsStatusResponse } from "@/types/trucks.types";
import MaintenancePageClient from "./_components/MaintenancePageClient";

export default async function MaintenancePage() {
    // Obtener todos los camiones para mostrar información básica
    const { trucks } = await getTrucks(1, 100);

    const list = trucks ?? [];

    // Optimización: usar endpoint bulk en lugar de múltiples llamadas individuales
    let componentsByTruckId: Record<number, TruckComponentsStatusResponse> = {};

    if (list.length > 0) {
        try {
            const truckIds = list.map(t => t.truck_id);
            const bulkResponse = await getBulkComponentsStatus(truckIds);

            // Convertir respuesta bulk al formato esperado por el cliente
            componentsByTruckId = Object.fromEntries(
                bulkResponse.successful_trucks.map(truck => [
                    truck.truck_id,
                    {
                        truck_id: truck.truck_id,
                        plate: truck.plate,
                        model: truck.model,
                        brand: truck.brand,
                        current_mileage: truck.current_mileage,
                        overall_health_status: truck.overall_health_status,
                        components: truck.components,
                        total_components: truck.total_components,
                        components_requiring_maintenance: truck.components_requiring_maintenance,
                        last_updated: truck.last_updated,
                    } as TruckComponentsStatusResponse
                ])
            );

            // Log de rendimiento
            console.log(`✅ Bulk components: ${bulkResponse.total_successful}/${bulkResponse.total_requested} camiones en ${bulkResponse.processing_time_ms}ms`);

            // Log de errores si los hay
            if (bulkResponse.failed_trucks.length > 0) {
                console.warn("⚠️ Algunos camiones fallaron:", bulkResponse.failed_trucks);
            }
        } catch (error) {
            console.error("Error obteniendo componentes bulk:", error);
            // Fallback: crear objetos vacíos para evitar errores en el cliente
            componentsByTruckId = Object.fromEntries(
                list.map(t => [t.truck_id, {
                    truck_id: t.truck_id,
                    plate: t.plate,
                    model: t.model,
                    brand: t.brand,
                    current_mileage: t.mileage,
                    overall_health_status: "Excellent" as const,
                    components: [],
                    total_components: 0,
                    components_requiring_maintenance: 0,
                    last_updated: new Date().toISOString(),
                }])
            );
        }
    }

    return <MaintenancePageClient initialTrucks={list} componentsByTruckId={componentsByTruckId} />;
}
