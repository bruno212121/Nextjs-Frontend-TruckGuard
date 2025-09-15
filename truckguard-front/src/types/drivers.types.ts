export type { Driver } from "./trucks.types";


export interface DriverwithoutTruckResponse {
    drivers: Driver[];
    message?: string;
    success?: boolean;
}