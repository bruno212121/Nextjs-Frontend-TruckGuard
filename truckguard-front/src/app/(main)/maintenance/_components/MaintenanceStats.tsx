import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck, Users, Wrench, Activity } from "lucide-react";

export default function MaintenanceStats({
    kpis
}: {
    kpis: {
        totalTrucks: number;
        trucksWithDriver: number;
        trucksWithoutDriver: number;
        totalComponents: number;
    }
}) {
    const { totalTrucks, trucksWithDriver, trucksWithoutDriver } = kpis;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-white">Total Camiones</CardTitle>
                    <Truck className="h-4 w-4 text-blue-400" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-white">{totalTrucks}</div>
                    <p className="text-xs text-slate-300">En la flota</p>
                </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-white">Con Conductor</CardTitle>
                    <Users className="h-4 w-4 text-green-400" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-white">{trucksWithDriver}</div>
                    <p className="text-xs text-slate-300">Asignados</p>
                </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-white">Sin Conductor</CardTitle>
                    <Activity className="h-4 w-4 text-orange-400" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-white">{trucksWithoutDriver}</div>
                    <p className="text-xs text-slate-300">Disponibles</p>
                </CardContent>
            </Card>
        </div>
    );
}
