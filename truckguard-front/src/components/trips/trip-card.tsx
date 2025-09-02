"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
    Truck,
    Calendar,
    User,
    Navigation,
    CheckCircle,
    AlertCircle,
    PlayCircle,
    Eye,
    Trash2,
    AlertTriangle,
} from "lucide-react"

import { Trip } from "@/types/trips.types"

interface TripCardProps {
    trip: Trip
    onStatusChange: (tripId: number, newStatus: string) => void
    onDelete: (tripId: number) => void
    onViewDetails: (trip: Trip) => void
  }
  
export default function TripCard({ trip, onStatusChange, onDelete, onViewDetails }: TripCardProps) {
    const getStatusBadge = (status: string) => {
      switch (status) {
        case "Completed":
          return (
            <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200">
              <CheckCircle className="h-3 w-3 mr-1" />
              Completado
            </Badge>
          )
        case "Active":
          return (
            <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
              <PlayCircle className="h-3 w-3 mr-1" />
              Activo
            </Badge>
          )
        case "Pending":
          return (
            <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">
              <AlertCircle className="h-3 w-3 mr-1" />
              Pendiente
            </Badge>
          )
        default:
          return <Badge variant="secondary">{status}</Badge>
      }
    }
  
    const getActionButtons = () => {
      const buttons = []
  
      if (trip.status === "Pending") {
        buttons.push(
          <Button
            key="activate"
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => onStatusChange(trip.trip_id, "Active")}
          >
            <PlayCircle className="h-3 w-3 mr-1" />
            Activar
          </Button>
        )
      }
  
      if (trip.status === "Active") {
        buttons.push(
          <Button
            key="complete"
            size="sm"
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
            onClick={() => onStatusChange(trip.trip_id, "Completed")}
          >
            <CheckCircle className="h-3 w-3 mr-1" />
            Completar
          </Button>
        )
      }
  
      return buttons
    }
  
    return (
      <Card className="hover:shadow-lg transition-all duration-200 hover:scale-[1.01] border-0 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
              Viaje #{trip.trip_id}
            </CardTitle>
            {getStatusBadge(trip.status)}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Ruta */}
            <div className="flex items-center gap-2">
              <Navigation className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {trip.origin} → {trip.destination}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Ruta</p>
              </div>
            </div>
  
            {/* Camión */}
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-emerald-600" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{trip.truck.plate}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {trip.truck.brand} {trip.truck.model}
                </p>
              </div>
            </div>
  
            {/* Conductor */}
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-amber-600" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {trip.driver.name} {trip.driver.surname}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Conductor</p>
              </div>
            </div>
  
            {/* Fecha */}
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {new Date(trip.date).toLocaleDateString("es-ES")}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(trip.date).toLocaleTimeString("es-ES", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          </div>
  
          <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewDetails(trip)}
                className="text-blue-600 border-blue-200 hover:bg-blue-50 dark:hover:bg-blue-900/20"
              >
                <Eye className="h-3 w-3 mr-1" />
                Ver Detalles
              </Button>
              {getActionButtons()}
            </div>
  
            {trip.status === "Completed" && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 border-red-200 hover:bg-red-50 dark:hover:bg-red-900/20 bg-transparent"
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Eliminar
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                      ¿Eliminar viaje?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      <strong>¡Atención!</strong> Si eliminas este viaje se perderán las métricas asociadas en
                      el dashboard. Esta acción no se puede deshacer.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => onDelete(trip.trip_id)}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Eliminar Viaje
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </CardContent>
      </Card>
    )
}
