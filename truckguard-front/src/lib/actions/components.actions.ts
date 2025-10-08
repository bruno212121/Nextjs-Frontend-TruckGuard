"use server"

import { cookies } from "next/headers"

// Tipos para el endpoint bulk
export interface BulkComponentStatus {
    truck_id: number;
    plate: string;
    model: string;
    brand: string;
    current_mileage: number;
    overall_health_status: "Excellent" | "Very Good" | "Good" | "Fair" | "Maintenance Required";
    components: Array<{
        component_name: string;
        current_status: "Excellent" | "Very Good" | "Good" | "Fair" | "Maintenance Required";
        health_percentage: number;
        last_maintenance_mileage: number;
        next_maintenance_mileage: number;
        km_remaining: number;
        maintenance_interval?: number;
    }>;
    total_components: number;
    components_requiring_maintenance: number;
    last_updated: string;
}

export interface BulkComponentsResponse {
    successful_trucks: BulkComponentStatus[];
    failed_trucks: Array<{
        truck_id: number;
        error: string;
    }>;
    total_requested: number;
    total_successful: number;
    total_failed: number;
    processing_time_ms: number;
}

/**
 * POST /components/bulk/status
 * Obtiene el estado de componentes de múltiples camiones en una sola llamada optimizada
 * Solo disponible para owners
 */
export const getBulkComponentsStatus = async (truckIds: number[]): Promise<BulkComponentsResponse> => {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value

    // Validar que truckIds no esté vacío y no exceda el límite
    if (!truckIds || truckIds.length === 0) {
        throw new Error("truck_ids es requerido y no puede estar vacío")
    }

    if (truckIds.length > 50) {
        throw new Error("Máximo 50 camiones por request")
    }

    const response = await fetch(`${process.env.BACKENDURL}/components/bulk/status`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ truck_ids: truckIds }),
        cache: "no-store",
    })

    if (!response.ok) {
        const msg = await response.text().catch(() => "Failed to get bulk components status")
        throw new Error(`Failed to get bulk components status (${response.status} - ${msg})`)
    }

    const data = await response.json()
    return data
}
