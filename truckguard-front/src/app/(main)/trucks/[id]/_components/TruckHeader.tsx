"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const statusColor: Record<string, string> = {
    Activo: "bg-emerald-100 text-emerald-800 border-emerald-200",
    Mantenimiento: "bg-amber-100 text-amber-800 border-amber-200",
    Inactivo: "bg-red-100 text-red-800 border-red-200",
};

export default function TruckHeader({
    plate,
    status,
    subtitle,
}: {
    plate: string;
    status: string;
    subtitle: string;
}) {
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                <Link href="/trucks">
                    <Button
                        variant="outline"
                        className="gap-2 bg-slate-800/50 border-slate-600 text-slate-300 hover:bg-slate-700/50 hover:text-white"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Volver a Camiones
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-white">Análisis de Camión</h1>
                    <p className="text-slate-300 mt-1">{subtitle}</p>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <Badge className={statusColor[status] ?? "bg-gray-100 text-gray-800"}>
                    {status}
                </Badge>
            </div>
        </div>
    );
}
