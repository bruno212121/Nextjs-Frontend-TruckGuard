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
    driver: Driver | null;
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

export interface ComponentStatus {
    component_name: string;
    current_status: "Excellent" | "Very Good" | "Good" | "Fair" | "Maintenance Required";
    health_percentage: number;
    last_maintenance_mileage: number;
    next_maintenance_mileage: number;
    km_remaining: number;
    maintenance_interval: number;
}

export interface TruckComponentsStatusResponse {
    truck_id: number;
    plate: string;
    model: string;
    brand: string;
    current_mileage: number;
    overall_health_status: "Excellent" | "Very Good" | "Good" | "Fair" | "Maintenance Required";
    components: ComponentStatus[];
    total_components: number;
    components_requiring_maintenance: number;
    last_updated: string;
}

export interface MaintenanceRecord {
    maintenance_id: number;
    description: string;
    status: "Excellent" | "Very Good" | "Good" | "Fair" | "Maintenance Required";
    component: string;
    cost: number;
    mileage_interval: number;
    last_maintenance_mileage: number;
    next_maintenance_mileage: number;
    created_at: string;
    updated_at: string;
    truck: {
        truck_id: number;
        plate: string;
        model: string;
        brand: string;
        mileage: number;
    };
    driver: {
        id: number;
        name: string;
        surname: string;
        email: string;
    };
}

export interface TruckMaintenanceHistoryResponse {
    maintenances: MaintenanceRecord[];
}