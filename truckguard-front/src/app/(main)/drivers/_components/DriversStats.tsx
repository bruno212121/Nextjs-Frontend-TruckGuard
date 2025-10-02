"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Truck as TruckIcon } from "lucide-react";
import type { Truck } from "@/types/trucks.types";

export default function DriversStats({
    drivers,
    trucks,
}: {
    drivers: Array<any>;
    trucks: Truck[];
}) {
    // Todos los conductores sin camión están disponibles
    const available = drivers.length;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-white">Conductores Disponibles</CardTitle>
                    <Users className="h-4 w-4 text-green-400" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-white">{available}</div>
                    <p className="text-xs text-slate-300">Sin camión asignado</p>
                </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-white">Camiones Inactivos</CardTitle>
                    <TruckIcon className="h-4 w-4 text-orange-400" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-white">{trucks.length}</div>
                    <p className="text-xs text-slate-300">Sin conductor</p>
                </CardContent>
            </Card>

        </div>
    );
}
