"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Wrench, Truck, User, Calendar, Check, X, Edit } from "lucide-react";
import Link from "next/link";

interface PendingMaintenance {
    maintenance_id: number;
    description: string;
    status: string;
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

interface PendingMaintenancesData {
    pending_maintenances: PendingMaintenance[];
    total_pending: number;
}

interface PendingMaintenancesClientProps {
    initialData: PendingMaintenancesData;
}

export default function PendingMaintenancesClient({ initialData }: PendingMaintenancesClientProps) {
    const [maintenances, setMaintenances] = useState(initialData.pending_maintenances);
    const [processing, setProcessing] = useState<number | null>(null);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("es-ES", {
            style: "currency",
            currency: "ARS",
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const handleApproval = async (maintenanceId: number, approvalStatus: "Approved" | "Rejected") => {
        setProcessing(maintenanceId);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKENDURL}/Maintenance/${maintenanceId}/approve`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({
                    approval_status: approvalStatus
                }),
            });

            if (response.ok) {
                // Remover el mantenimiento de la lista
                setMaintenances(prev => prev.filter(m => m.maintenance_id !== maintenanceId));
            } else {
                console.error("Error al procesar la solicitud");
            }
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setProcessing(null);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-slate-900 via-gray-900 to-slate-800 p-6">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <Link
                        href="/dashboard"
                        className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Volver al Dashboard
                    </Link>

                    <Badge className="bg-yellow-600 text-white px-3 py-1">
                        {maintenances.length} Pendiente{maintenances.length !== 1 ? 's' : ''}
                    </Badge>
                </div>

                <div className="text-center">
                    <h1 className="text-4xl font-bold text-white mb-2">
                        Mantenimientos Pendientes
                    </h1>
                    <p className="text-slate-300">
                        Gestiona las solicitudes de mantenimiento de tu flota
                    </p>
                </div>
            </div>

            {/* Lista de mantenimientos */}
            <div className="space-y-6">
                {maintenances.length === 0 ? (
                    <div className="text-center py-12">
                        <Wrench className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-white mb-2">No hay mantenimientos pendientes</h3>
                        <p className="text-slate-400">Todos los mantenimientos están al día</p>
                    </div>
                ) : (
                    maintenances.map((maintenance) => (
                        <Card key={maintenance.maintenance_id} className="bg-slate-800/50 border-slate-700">
                            <CardHeader className="pb-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-slate-700 rounded-lg">
                                            <Wrench className="h-6 w-6 text-yellow-400" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-xl text-white">
                                                {maintenance.component} - {maintenance.truck.plate}
                                            </CardTitle>
                                            <p className="text-slate-300">{maintenance.description}</p>
                                        </div>
                                    </div>
                                    <Badge className="bg-yellow-600 text-white px-3 py-1">
                                        {formatCurrency(maintenance.cost)}
                                    </Badge>
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-6">
                                {/* Información del camión y conductor */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="flex items-center gap-3">
                                        <Truck className="h-5 w-5 text-slate-400" />
                                        <div>
                                            <p className="text-slate-400 text-sm">Camión</p>
                                            <p className="text-white font-medium">
                                                {maintenance.truck.brand} {maintenance.truck.model}
                                            </p>
                                            <p className="text-white text-sm">{maintenance.truck.mileage.toLocaleString()} km</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <User className="h-5 w-5 text-slate-400" />
                                        <div>
                                            <p className="text-slate-400 text-sm">Conductor</p>
                                            <p className="text-white font-medium">
                                                {maintenance.driver.name} {maintenance.driver.surname}
                                            </p>
                                            <p className="text-white text-sm">{maintenance.driver.email}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <Calendar className="h-5 w-5 text-slate-400" />
                                        <div>
                                            <p className="text-slate-400 text-sm">Fecha de Solicitud</p>
                                            <p className="text-white font-medium">
                                                {formatDate(maintenance.created_at)}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Historial de mantenimiento */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <p className="text-slate-400 text-sm">Último Mantenimiento</p>
                                        <p className="text-white font-medium">
                                            {maintenance.last_maintenance_mileage.toLocaleString()} km
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-slate-400 text-sm">Próximo Mantenimiento</p>
                                        <p className="text-white font-medium">
                                            {maintenance.next_maintenance_mileage.toLocaleString()} km
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-slate-400 text-sm">Intervalo</p>
                                        <p className="text-white font-medium">
                                            {maintenance.mileage_interval.toLocaleString()} km
                                        </p>
                                    </div>
                                </div>

                                {/* Botones de acción */}
                                <div className="flex gap-3 pt-4">
                                    <Button
                                        onClick={() => handleApproval(maintenance.maintenance_id, "Approved")}
                                        disabled={processing === maintenance.maintenance_id}
                                        className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                                    >
                                        <Check className="h-4 w-4 mr-2" />
                                        {processing === maintenance.maintenance_id ? "Procesando..." : "Aprobar"}
                                    </Button>

                                    <Button
                                        onClick={() => handleApproval(maintenance.maintenance_id, "Rejected")}
                                        disabled={processing === maintenance.maintenance_id}
                                        className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                                    >
                                        <X className="h-4 w-4 mr-2" />
                                        {processing === maintenance.maintenance_id ? "Procesando..." : "Rechazar"}
                                    </Button>

                                    <Button
                                        variant="outline"
                                        className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
                                    >
                                        <Edit className="h-4 w-4 mr-2" />
                                        Editar
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
