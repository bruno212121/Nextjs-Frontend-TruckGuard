"use server"

import { cookies } from "next/headers"

export const getFleetAnalytics = async () => {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value
    const response = await fetch(`${process.env.BACKENDURL}/Fleetanalytics/analytics`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    })
    if (!response.ok) {
        throw new Error("Failed to get fleet analytics")
    }
    const data = await response.json()

    return data
}

export const getPendingMaintenances = async () => {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value
    const response = await fetch(`${process.env.BACKENDURL}/Maintenance/pending`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    })
    if (!response.ok) {
        throw new Error("Failed to get pending maintenances")
    }
    const data = await response.json()

    return data
}

export const refreshFleetAnalytics = async () => {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value

    if (!token) {
        throw new Error("No authentication token found")
    }

    try {
        const response = await fetch(`${process.env.BACKENDURL}/Fleetanalytics/analytics/refresh`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        })

        if (!response.ok) {
            throw new Error(`Failed to refresh fleet analytics: ${response.statusText}`)
        }

        const data = await response.json()
        return data
    } catch (error) {
        console.error("Error refreshing fleet analytics:", error)
        throw error
    }
}