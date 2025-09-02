"use client"

import { Badge } from "@/components/ui/badge"
import { Activity } from "lucide-react"

interface DashboardHeaderProps {
    lastUpdated: string
}

export default function DashboardHeader({ lastUpdated }: DashboardHeaderProps) {
    return (
        <div className="flex items-center justify-between mb-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    📊 Métricas en Tiempo Real
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Última actualización: {new Date(lastUpdated).toLocaleString("es-ES")}
                </p>
            </div>
            <Badge className="bg-blue-600 text-white hover:bg-blue-700 animate-pulse">
                <Activity className="h-3 w-3 mr-1" />
                En vivo
            </Badge>
        </div>
    )
}
