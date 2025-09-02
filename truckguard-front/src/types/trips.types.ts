export interface Truck {
    truck_id: number
    plate: string
    model: string
    brand: string
}

export interface Driver {
    id: number
    name: string
    surname: string
    phone: string
    email: string
}

export interface Trip {
    trip_id: number
    origin: string
    destination: string
    status: "Pending" | "Active" | "Completed"
    date: string
    created_at: string
    updated_at: string
    truck: Truck
    driver: Driver
}

export interface TripResponse {
    trips: Trip[]
    total: number
    page: number
    pages: number
}

export interface SingleTripResponse {
    trip: Trip
}

export interface CreateTripRequest {
    origin: string
    destination: string
    truck_id: number
    driver_id: number
    status: "Pending" | "Active" | "Completed"
    date: string
}

export interface UpdateTripRequest {
    origin?: string
    destination?: string 
    truck_id?: number
    driver_id?: number
    status?: "Pending" | "Active" | "Completed"
    date?: string
}

