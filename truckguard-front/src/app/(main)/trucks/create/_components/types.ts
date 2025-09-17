export type HealthStatusValue = "Excellent" | "Good" | "Very Good" | "Fair" | "Maintenance Required";

export interface AvailableDriver {
  id: number;
  name: string;
  surname: string;
  email: string;
  phone: string;
}

export interface NewTruckForm {
  plate: string;
  model: string;
  brand: string;
  year: string;
  color: string;
  mileage: string;
  health_status: HealthStatusValue;
  status: string;
  fleetanalytics_id: number;
}

export interface TruckComponentForm {
  name: string;
  interval: number;
  status: HealthStatusValue;
  last_maintenance_mileage: number;
  next_maintenance_mileage: number;
}