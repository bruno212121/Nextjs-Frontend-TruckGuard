"use server"

import { cookies } from "next/headers"
import { TruckResponse, SingleTruckResponse } from "@/types/trucks.types"


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

