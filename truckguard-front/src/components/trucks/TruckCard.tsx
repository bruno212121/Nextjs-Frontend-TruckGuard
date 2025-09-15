"use client";

import Link from "next/link";
import { useMemo } from "react";
import type { Truck } from "@/types/trucks.types";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Settings, Edit, UserMinus, UserPlus } from "lucide-react";

import StatusSelect from "./StatusSelect";
import DriverInfo from "./DriverInfo";
import AssignDriverDialog from "./AssignDriverSelect";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

export function getStatusColor(status: string) {
    switch (status.toLowerCase()) {
        case "activo": return "bg-emerald-100 text-emerald-800 border border-emerald-200";
        case "mantenimiento": return "bg-amber-100 text-amber-800 border border-amber-200";
        case "inactivo": return "bg-red-100 text-red-800 border border-red-200";
        default: return "bg-slate-100 text-slate-800 border border-slate-200";
    }
}

type DriverLite = { id: number; name: string; surname: string };

type Props = {
    truck: Truck;
    availableDrivers: DriverLite[];
    onChangeStatus: (truckId: number, newStatus: "Activo" | "Mantenimiento" | "Inactivo") => void;
    onAssignDriver: (truckId: number, driverId: number) => void;
    onRemoveDriver: (truckId: number) => void;
};

export default function TruckCard({
    truck, availableDrivers, onChangeStatus, onAssignDriver, onRemoveDriver,
}: Props) {
    const mileage = useMemo(() => Number(truck.mileage).toLocaleString(), [truck.mileage]);

    return (

        <Card
            key={truck.truck_id}
            className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors"
        >
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold text-white">{truck.plate}</CardTitle>
                    <Badge className={getStatusColor(truck.status)}>{truck.status}</Badge>
                </div>
                <p className="text-slate-300">
                    {truck.brand} {truck.model} ({truck.year})
                </p>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <p className="text-slate-400">Kilometraje</p>
                        <p className="text-white font-medium">{truck.mileage.toLocaleString()} km</p>
                    </div>
                    <div>
                        <p className="text-slate-400">Color</p>
                        <p className="text-white font-medium">{truck.color}</p>
                    </div>
                </div>

                {truck.driver && (
                    <div className="p-3 bg-slate-700/50 rounded-lg">
                        <p className="text-slate-400 text-sm">Conductor asignado</p>
                        <p className="text-white font-medium">
                            {truck.driver.name} {truck.driver.surname}
                        </p>
                        <p className="text-slate-300 text-sm">{truck.driver.email}</p>
                    </div>
                )}

                {/* Acciones */}
                <div className="flex flex-wrap gap-2 pt-2">
                    <Link href={`/truck/${truck.truck_id}`}>
                        <Button
                            size="sm"
                            variant="outline"
                            className="bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600"
                        >
                            <Settings className="h-3 w-3 mr-1" />
                            Ver Detalles
                        </Button>
                    </Link>

                    {/* Cambiar estado */}
                    <Select value={truck.status} onValueChange={(value) => onChangeStatus(truck.truck_id, value as "Activo" | "Mantenimiento" | "Inactivo")}>
                        <SelectTrigger className="w-auto h-8 bg-white border-slate-600 text-slate-800 text-xs">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-700 border-slate-600">
                            <SelectItem value="Activo" className="text-white hover:bg-slate-600">
                                Activo
                            </SelectItem>
                            <SelectItem value="Mantenimiento" className="text-white hover:bg-slate-600">
                                Mantenimiento
                            </SelectItem>
                            <SelectItem value="Inactivo" className="text-white hover:bg-slate-600">
                                Inactivo
                            </SelectItem>
                        </SelectContent>
                    </Select>

                    {/* Gestión de conductor */}
                    {truck.driver ? (
                        <div className="flex gap-1">
                            <AssignDriverDialog
                                trigger={
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="bg-slate-700 border-slate-600 text-slate-300 text-white hover:bg-slate-600"
                                    >
                                        <Edit className="h-3 w-3" />
                                    </Button>
                                }
                                plate={truck.plate}
                                drivers={availableDrivers}
                                initialDriverId={truck.driver?.id ?? null}
                                onConfirm={(driverId) => onAssignDriver(truck.truck_id, driverId)}
                            />
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => onRemoveDriver(truck.truck_id)}
                                className="bg-red-900/20 border-red-700 text-red-400 text-white hover:bg-red-900/30"
                            >
                                <UserMinus className="h-3 w-3" />
                            </Button>
                        </div>
                    ) : (
                        <AssignDriverDialog
                            trigger={
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="bg-slate-700 border-slate-600 text-slate-300 text-white text-xs hover:bg-slate-600"
                                >
                                    <UserPlus className="h-3 w-3 mr-1" />
                                    Asignar
                                </Button>
                            }
                            plate={truck.plate}
                            drivers={availableDrivers}
                            onConfirm={(driverId) => onAssignDriver(truck.truck_id, driverId)}
                        />
                    )}
                </div>
            </CardContent>
        </Card>


    );
}
