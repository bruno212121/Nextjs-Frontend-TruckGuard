"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Truck,
  Users,
  MapPin,
  Wrench,
  DollarSign,
  Activity,
  TrendingUp,
  TrendingDown,
} from "lucide-react"
    
// Tipos basados en tu JSON real
interface MetricsData {
  analytics_id: number
  owner_id: number
  total_trucks: number
  active_trucks: number
  total_drivers: number
  available_drivers: number
  total_trips: number
  completed_trips: number
  pending_trips: number
  total_maintenance: number
  pending_maintenance: number
  total_cost: number
  average_cost_per_trip: number
  fleet_health_score: number
  created_at: string
  updated_at: string
}

interface MetricCardProps {
  title: string
  value: string | number
  icon: any
  trend?: "up" | "down" | "neutral"
  trendValue?: string | number
  color?: "default" | "success" | "warning" | "danger"
}

const MetricCard = ({ title, value, icon: Icon, trend, trendValue, color = "default" }: MetricCardProps) => {
  const colorClasses = {
    default: "border-l-blue-500 bg-gradient-to-br from-blue-50 to-blue-100/50",
    success: "border-l-emerald-500 bg-gradient-to-br from-emerald-50 to-emerald-100/50",
    warning: "border-l-amber-500 bg-gradient-to-br from-amber-50 to-amber-100/50",
    danger: "border-l-red-500 bg-gradient-to-br from-red-50 to-red-100/50",
  }

  const iconColorClasses = {
    default: "text-blue-600",
    success: "text-emerald-600",
    warning: "text-amber-600",
    danger: "text-red-600",
  }

  return (
    <Card className={`border-l-4 ${colorClasses[color]} hover:shadow-lg transition-all duration-200 hover:scale-[1.02] border-0 shadow-sm`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</CardTitle>
        <div className={`p-2 rounded-lg bg-white/80 dark:bg-gray-900/20 ${iconColorClasses[color]}`}>
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-xl font-bold text-gray-900 dark:text-white mb-1">{value}</div>
        {trend && trendValue && (
          <div className="flex items-center text-xs">
            {trend === "up" ? (
              <div className="flex items-center text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full">
                <TrendingUp className="h-3 w-3 mr-1" />
                <span className="font-medium">{trendValue}</span>
              </div>
            ) : trend === "down" ? (
              <div className="flex items-center text-red-600 bg-red-100 px-2 py-1 rounded-full">
                <TrendingDown className="h-3 w-3 mr-1" />
                <span className="font-medium">{trendValue}</span>
              </div>
            ) : (
              <div className="flex items-center text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                <span className="font-medium">{trendValue}</span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

interface MetricsCardsProps {
  data: MetricsData
}

export default function MetricsCards({ data }: MetricsCardsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "ARS",
    }).format(amount)
  }

  return (
    <div className="space-y-6">
      {/* Grid de métricas principales - USANDO DATOS REALES */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Camiones Activos"
          value={data.active_trucks} // 4
          icon={Truck}
          trend="up"
          trendValue="+2"
          color="success"
        />
        <MetricCard
          title="Total Camiones"
          value={data.total_trucks} // 5
          icon={Truck}
          trend="up"
          trendValue="+1"
          color="default"
        />
        <MetricCard
          title="Conductores Disponibles"
          value={data.available_drivers} // 2
          icon={Users}
          trend="neutral"
          trendValue="0"
          color="warning"
        />
        <MetricCard
          title="Viajes Completados"
          value={data.completed_trips} // 12
          icon={MapPin}
          trend="up"
          trendValue="+3"
          color="success"
        />
      </div>

      {/* Segunda fila de métricas - USANDO DATOS REALES */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <MetricCard
          title="Costo Total"
          value={formatCurrency(data.total_cost)} // 180270
          icon={DollarSign}
          trend="up"
          trendValue="+5.2%"
          color="warning"
        />
        <MetricCard
          title="Costo Promedio por Viaje"
          value={formatCurrency(data.average_cost_per_trip)} // 15022.5
          // icono peso argentino
          icon={DollarSign}
          trend="down"
          trendValue="-2.1%"
          color="success"
        />
        <MetricCard
          title="Puntuación de Salud de Flota"
          value={`${data.fleet_health_score}%`} // 92%
          icon={Activity}
          trend="up"
          trendValue="+3%"
          color="success"
        />
      </div>

      {/* Métricas de mantenimiento - USANDO DATOS REALES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <MetricCard
          title="Mantenimiento Total"
          value={formatCurrency(data.total_maintenance)} // 180270
          icon={Wrench}
          trend="neutral"
          trendValue="Sin cambios"
          color="default"
        />
        <MetricCard
          title="Mantenimiento Pendiente"
          value={data.pending_maintenance === 0 ? "Ninguno" : data.pending_maintenance} // 0
          icon={Wrench}
          trend="neutral"
          trendValue="Todo al día"
          color="success"
        />
      </div>
    </div>
  )
}