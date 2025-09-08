export interface Driver {
    id: number;
    name: string;
    surname: string;
    email: string;
    phone: string;
    role: string;
}

export interface Truck {
    truck_id: number;
    plate: string;
    model: string;
    brand: string;
    year: string;
    mileage: number;
    color: string;
    status: string;
    updated_at: string;
    driver: Driver;
}

export interface TruckResponse {
    trucks: Truck[];
    message?: string;
    success?: boolean;
}

export interface SingleTruckResponse {
    truck: Truck;
    message?: string;
    success?: boolean;
}
