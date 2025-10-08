"use server"

import { cookies } from "next/headers"
import { TruckResponse, SingleTruckResponse, Truck, TruckComponentsStatusResponse, TruckMaintenanceHistoryResponse } from "@/types/trucks.types"


export const getTrucks = async (page: number = 1, per_page: number = 5): Promise<TruckResponse> => {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value

    const response = await fetch(`${process.env.BACKENDURL}/Trucks/all?page=${page}&per_page=${per_page}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Accept": "application/json",
        },
        cache: "no-store",
    })

    if (!response.ok) {
        const msg = await response.text().catch(() => "Failed to get trucks")
        throw new Error("Failed to get trucks ($(response.status) - ${msg})")
    }

    const data = (await response.json()) as TruckResponse
    if (!Array.isArray(data?.trucks)) {
        throw new Error("API shape inesperada: se esperaba { trucks: Truck[] }")
    }

    return data
}

export const getTruck = async (id: number): Promise<SingleTruckResponse> => {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value
    const response = await fetch(`${process.env.BACKENDURL}/Trucks/${id}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    })

    if (!response.ok) {
        throw new Error("Failed to get truck")
    }

    return response.json()
}

/**
 * POST /Trucks/new
 * payload: datos del camión (y opcional driver_id)
 */

export const createTruck = async (playload: Partial<Truck>): Promise<Truck> => {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value

    const response = await fetch(`${process.env.BACKENDURL}/Trucks/new`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(playload)
    })

    if (!response.ok) {
        throw new Error("Failed to create truck")
    }
    const data = await response.json()
    return data
}

/**
 * PUT /Trucks/{id}/assign
 * body: { driver_id: number }
 */

export const assignTruck = async (id: number, driver_id: number): Promise<Truck> => {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value

    const response = await fetch(`${process.env.BACKENDURL}/Trucks/${id}/assign`, {
        method: "PUT",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ driver_id })
    })

    if (!response.ok) {
        throw new Error("Failed to assign truck")
    }
    const data = await response.json()
    return data
}

/**
 * PUT /Trucks/{id}/unassign
 * Remueve el conductor asignado al camión
 */
export const unassignTruck = async (id: number): Promise<any> => {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value

    const response = await fetch(`${process.env.BACKENDURL}/Trucks/${id}/unassign`, {
        method: "PUT",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    })

    if (!response.ok) {
        throw new Error("Failed to unassign truck")
    }
    const data = await response.json()
    return data
}

/**
 * PUT /Trucks/{id}/edit
 * Se usa para actualizar propiedades del camión (ej: status, color, mileage, etc.)
 * Ejemplo para cambiar estado: editTruck(id, { status: "Mantenimiento" })
 */

export const editTruck = async (id: number, playload: Partial<Truck>): Promise<Truck> => {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value

    const response = await fetch(`${process.env.BACKENDURL}/Trucks/${id}/edit`, {
        method: "PUT",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(playload)
    })

    if (!response.ok) {
        throw new Error("Failed to edit truck")
    }
    const data = await response.json()
    return data
}

/**
 * GET /Trucks/{truckid}/components-status
 * Obtiene el estado en tiempo real de todos los componentes de un camión específico
 */
export const getTruckComponentsStatus = async (truckId: number): Promise<TruckComponentsStatusResponse> => {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value

    // Endpoint correcto del backend: /components/{id}/status
    const response = await fetch(`${process.env.BACKENDURL}/components/${truckId}/status`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Accept": "application/json",
        },
        cache: "no-store",
    })

    if (!response.ok) {
        const msg = await response.text().catch(() => "Failed to get truck components status")
        throw new Error(`Failed to get truck components status (${response.status} - ${msg})`)
    }

    const data = await response.json()
    return data
}

/**
 * GET /Maintenance/{truckid}/components
 * Obtiene el historial completo de mantenimientos de un camión específico
 */
export const getTruckMaintenanceHistory = async (truckId: number): Promise<TruckMaintenanceHistoryResponse> => {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value

    const response = await fetch(`${process.env.BACKENDURL}/Maintenance/${truckId}/components`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Accept": "application/json",
        },
        cache: "no-store",
    })

    if (!response.ok) {
        const msg = await response.text().catch(() => "Failed to get truck maintenance history")
        throw new Error(`Failed to get truck maintenance history (${response.status} - ${msg})`)
    }

    const data = await response.json()
    return data
}

/**
 * POST /Maintenance/new
 * Crea una nueva orden de mantenimiento
 */
export const createMaintenance = async (payload: {
    description: string;
    component: string;
    truck_id: number;
    driver_id: number | null;
    cost: number;
    mileage_interval: number;
    maintenance_interval: number;
}): Promise<any> => {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value

    const response = await fetch(`${process.env.BACKENDURL}/Maintenance/new`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    })

    if (!response.ok) {
        const msg = await response.text().catch(() => "Failed to create maintenance")
        throw new Error(`Failed to create maintenance (${response.status} - ${msg})`)
    }

    const data = await response.json()
    return data
}

