import type { Driver } from "./trucks.types";

export type { Driver };


export interface DriverwithoutTruckResponse {
    drivers: Driver[];
    message?: string;
    success?: boolean;
}