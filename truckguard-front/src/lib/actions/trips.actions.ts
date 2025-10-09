"use server"

import { cookies } from "next/headers"
import { TripResponse, SingleTripResponse, UpdateTripRequest } from "@/types/trips.types"

export type TripBlocked = {
  code: "TRIP_BLOCKED_COMPONENTS";
  severity: "critical" | "warning" | "error";
  reason: "components_requiring_maintenance" | "components_fair_condition";
  components: string[];              // ← acá viene ["Aceite", ...]
  message: string;
  statusCode: number;
};

export type CreateTripSuccess = { ok: true; data: any };
export type CreateTripFailure = { ok: false; error: TripBlocked | { message: string; statusCode: number } };
export type CreateTripResult = CreateTripSuccess | CreateTripFailure;

export type CreateTripRequest = {
  origin: string;
  destination: string;
  truck_id: number;
  driver_id: number;
  status: "Pending" | "In Course" | "Completed";
  date: string; // ISO local (ej: "2025-10-09T19:18")
};


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


export async function createTrips(tripData: CreateTripRequest): Promise<CreateTripResult> {
  const token = (await cookies()).get("token")?.value;

  const res = await fetch(`${process.env.BACKENDURL}/Trips/new`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token ?? ""}`,
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    cache: "no-store",
    body: JSON.stringify(tripData),
  });

  if (res.ok) {
    const data = await res.json().catch(() => ({}));
    return { ok: true, data };
  }

  // Error: intentamos parsear cuerpo JSON del backend (409/422)
  try {
    const err = await res.json();
    // Aseguramos statusCode y normalizamos campos
    const normalized = {
      statusCode: res.status,
      message: err?.message ?? "Error al crear el viaje",
      code: err?.code,
      severity: err?.severity,
      reason: err?.reason,
      components: Array.isArray(err?.components) ? err.components : [],
    };
    return { ok: false, error: normalized as TripBlocked };
  } catch {
    // Fallback si no vino JSON
    return { ok: false, error: { message: "Error al crear el viaje", statusCode: res.status } };
  }
}

//completar viaje
export const updateTrips = async (id: number): Promise<any> => {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value

  const response = await fetch(`${process.env.BACKENDURL}/Trips/${id}/complete`, {
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

//activar viaje
export const activateTrips = async (
  id: number,
  payload: Partial<CreateTripRequest | UpdateTripRequest> = { status: "In Course" }
): Promise<any> => {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value

  const response = await fetch(`${process.env.BACKENDURL}/Trips/${id}/update`, {
    method: "PATCH",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  })
  if (!response.ok) {
    throw new Error("Failed to activate trip")
  }
  const data = await response.json()
  return data
}


//eliminar viaje

export const deleteTrips = async (id: number): Promise<any> => {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value

  const response = await fetch(`${process.env.BACKENDURL}/Trips/${id}/delete`, {
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