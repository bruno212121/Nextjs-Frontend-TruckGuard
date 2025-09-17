"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Settings, Truck } from "lucide-react";
import type { HealthStatusValue, TruckComponentForm } from "./types";
import { healthStatuses } from "./TruckForm";

const truckStatuses = [
    { value: "active", label: "Activo", dot: "bg-green-500" },
    { value: "inactive", label: "Inactivo", dot: "bg-gray-500" },
    { value: "maintenance", label: "En Mantenimiento", dot: "bg-yellow-500" },
]; 

type Props = {
    createdTruck: {
        id: number;
        plate: string;
        brand: string;
        model: string;
        year: number;
        color: string;
        mileage: number;
        health_status: HealthStatusValue;
        status: string;
        driver_name?: string | null;
        components: TruckComponentForm[];
    };
    onCreateAnother: () => void;
};

export default function SuccessView({ createdTruck, onCreateAnother }: Props) {
    const healthStatus = healthStatuses.find((s) => s.value === createdTruck.health_status) || {
        value: createdTruck.health_status || "Good",
        label: createdTruck.health_status || "Bueno",
        dot: "bg-blue-500"
    };

    const truckStatus = truckStatuses.find((s) => s.value === createdTruck.status) || {
        value: createdTruck.status || "inactive",
        label: createdTruck.status || "Inactivo",
        dot: "bg-gray-500"
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <Alert className="bg-green-900/20 border-green-700 text-green-300">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription className="text-green-200">
                    ¡Camión creado exitosamente! El camión ha sido registrado en el sistema.
                </AlertDescription>
            </Alert>

            <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                        <Truck className="h-5 w-5" />
                        Detalles del Camión
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Item label="ID del Camión" value={`#${createdTruck.id}`} />
                        <Item label="Placa" value={createdTruck.plate} />
                        <Item label="Marca y Modelo" value={`${createdTruck.brand} ${createdTruck.model}`} />
                        <Item label="Año" value={String(createdTruck.year)} />
                        <Item label="Color" value={createdTruck.color} />
                        <Item label="Kilometraje" value={`${createdTruck.mileage} km`} />
                        <div>
                            <p className="text-slate-400 text-sm">Estado de Salud</p>
                            <Badge className={`${healthStatus?.dot} text-white`}>{healthStatus?.label}</Badge>
                        </div>
                        <div>
                            <p className="text-slate-400 text-sm">Estado del Camión</p>
                            <Badge className={`${truckStatus?.dot} text-white`}>{truckStatus?.label}</Badge>
                        </div>
                        {createdTruck.driver_name && <Item label="Conductor Asignado" value={createdTruck.driver_name} />}
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                        <Settings className="h-5 w-5" />
                        Componentes Registrados
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {createdTruck.components.map((c, i) => {
                            const cs = healthStatuses.find((s) => s.value === c.status) || {
                                value: c.status || "Good",
                                label: c.status || "Bueno",
                                dot: "bg-blue-500"
                            };
                            return (
                                <div key={i} className="p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                                    <h4 className="text-white font-semibold mb-2">{c.name}</h4>
                                    <div className="space-y-1 text-sm">
                                        <p className="text-slate-300">Intervalo: {c.interval.toLocaleString()} km</p>
                                        <p className="text-slate-300">Último mant.: {c.last_maintenance_mileage.toLocaleString()} km</p>
                                        <p className="text-slate-300">Próximo mant.: {c.next_maintenance_mileage.toLocaleString()} km</p>
                                        <Badge className={`${cs?.dot} text-white text-xs`}>{cs?.label}</Badge>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            <div className="flex gap-4 justify-center">
                <Link href="/trucks">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">Ver Todos los Camiones</Button>
                </Link>
                <Button
                    variant="outline"
                    onClick={onCreateAnother}
                    className="bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600"
                >
                    Crear Otro Camión
                </Button>
            </div>
        </div>
    );
}

function Item({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <p className="text-slate-400 text-sm">{label}</p>
            <p className="text-white font-semibold">{value}</p>
        </div>
    );
}
