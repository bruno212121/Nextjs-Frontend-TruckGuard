"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, Truck as TruckIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DriverCard({
    driver,
    onAssign,
}: {
    driver: {
        id: number;
        name: string;
        surname: string;
        email: string;
        phone: string;
        role: string;
    };
    onAssign: () => void;
}) {
    // Todos los conductores sin camión están disponibles
    const statusOk = true;

    return (
        <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors">
            <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                    <div className="min-w-0 flex-1">
                        <CardTitle className="text-lg text-white truncate">
                            {driver.name} {driver.surname}
                        </CardTitle>
                        <p className="text-sm text-slate-300 mt-1">ID: {driver.id}</p>
                    </div>
                    <Badge className="bg-green-600 text-white ml-2 shrink-0">
                        Disponible
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm text-slate-300">
                        <Mail className="h-4 w-4 shrink-0" />
                        <span className="truncate">{driver.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-300">
                        <Phone className="h-4 w-4 shrink-0" />
                        <span>{driver.phone}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-300">
                        <span className="bg-slate-700 px-2 py-1 rounded text-xs">{driver.role}</span>
                    </div>
                </div>

                <Button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={onAssign}
                    disabled={!statusOk}
                >
                    <TruckIcon className="h-4 w-4 mr-2" />
                    Asignar Camión
                </Button>
            </CardContent>
        </Card>
    );
}
