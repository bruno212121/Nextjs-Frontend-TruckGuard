"use server"

import { cookies } from "next/headers"
import { DriverwithoutTruckResponse } from "@/types/drivers.types"

/**
 * GET /Trucks/drivers_without_truck
 * Devuelve conductores que NO tienen camión asignado.
 */

export const getDriversWithoutTruck = async (): Promise<DriverwithoutTruckResponse> => {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value
    const response = await fetch(`${process.env.BACKENDURL}/Trucks/drivers_without_truck`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    })
    if (!response.ok) {
        throw new Error("Failed to get drivers without truck")
    }
    
    const data = await response.json()
    if (!Array.isArray(data?.drivers)) {
        throw new Error("API shape inesperada: se esperaba { drivers: Driver[] }")
    }

    return data;
}
