import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Truck as TruckIcon, User, Calendar, Gauge } from "lucide-react";
import type { Truck } from "@/types/trucks.types";

export default function TruckMaintenanceCard({
    truck
}: { truck: Truck }) {
    return (
        <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors">
            <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-xl text-white">{truck.plate}</CardTitle>
                        <p className="text-slate-300">{truck.brand} {truck.model} ({truck.year})</p>
                    </div>
                    <TruckIcon className="h-8 w-8 text-slate-400" />
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Información básica del camión */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 text-sm text-slate-300">
                        <Gauge className="h-4 w-4 shrink-0" />
                        <div>
                            <p className="text-slate-400">Kilometraje</p>
                            <p className="text-white font-medium">{truck.mileage.toLocaleString()} km</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 text-sm text-slate-300">
                        <Calendar className="h-4 w-4 shrink-0" />
                        <div>
                            <p className="text-slate-400">Estado</p>
                            <Badge className="bg-blue-600 text-white text-xs">
                                {truck.status}
                            </Badge>
                        </div>
                    </div>
                </div>

                {/* Información del conductor */}
                {truck.driver ? (
                    <div className="flex items-center gap-3 text-sm text-slate-300 p-3 bg-slate-700/50 rounded-lg">
                        <User className="h-4 w-4 shrink-0" />
                        <div>
                            <p className="text-slate-400">Conductor asignado</p>
                            <p className="text-white font-medium">{truck.driver.name} {truck.driver.surname}</p>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center gap-3 text-sm text-slate-300 p-3 bg-slate-700/50 rounded-lg">
                        <User className="h-4 w-4 shrink-0" />
                        <div>
                            <p className="text-slate-400">Sin conductor asignado</p>
                            <p className="text-orange-400 font-medium">Disponible</p>
                        </div>
                    </div>
                )}

                {/* Nota sobre componentes */}
                <div className="p-3 bg-slate-700/30 rounded-lg border border-slate-600">
                    <p className="text-sm text-slate-400 text-center">
                        Para ver el estado de componentes específicos, visita la página de detalles del camión
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
