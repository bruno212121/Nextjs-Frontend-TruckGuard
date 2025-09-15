"use server"

import { cookies } from "next/headers"
import { TruckResponse, SingleTruckResponse, Truck } from "@/types/trucks.types"


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

