"use server"

import { cookies } from "next/headers"
import { TripResponse, SingleTripResponse, CreateTripRequest, UpdateTripRequest } from "@/types/trips.types"


export const getTrips = async (page: number = 1, per_page: number = 5): Promise<TripResponse> => {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value
    
    const response = await fetch(`${process.env.BACKENDURL}/Trips/all?page=${page}&per_page=${per_page}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    })
    
    if (!response.ok) {
      throw new Error("Failed to get trips")
    }
    
    return response.json()
  }


  export const getTrip = async (id: number): Promise<SingleTripResponse> => {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value
    
    const response = await fetch(`${process.env.BACKENDURL}/Trips/${id}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    })
    
    if (!response.ok) {
      throw new Error("Failed to get trip")
    }
    
    return response.json()
  }
  

export const createTrips = async (tripData: CreateTripRequest): Promise<any> => {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value

    const response = await fetch(`${process.env.BACKENDURL}/Trips/new`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(tripData)
    })
    if (!response.ok) {
        throw new Error("Failed to create trip")
    }
    const data = await response.json()
    return data
}

//completar viaje
export const updateTrips = async (id: number): Promise<any> => {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value

    const response = await fetch(`${process.env.BACKENDURL}/Trips/complete/${id}`, {
        method: "PATCH",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
    })
    if (!response.ok) {
        throw new Error("Failed to complete trip")
    }
    const data = await response.json()
    return data
}


//eliminar viaje

export const deleteTrips = async (id: number): Promise<any> => {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value

    const response = await fetch(`${process.env.BACKENDURL}/Trips/delete/${id}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
    })
    if (!response.ok) {
        throw new Error("Failed to delete trip")
    }
    const data = await response.json()
    return data
}