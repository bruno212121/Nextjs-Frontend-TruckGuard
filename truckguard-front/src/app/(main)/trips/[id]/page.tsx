"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Truck,
    Calendar,
    User,
    Navigation,
    CheckCircle,
    AlertCircle,
    PlayCircle,
    ArrowLeft,
    MapPin,
    Clock,
    FileText,
} from "lucide-react"
import { Trip } from "@/types/trips.types"
import { getTrip } from "@/lib/actions/trips.actions"
import Link from "next/link"
import GoogleMaps from "@/components/google/google-maps"
import { useJsApiLoader } from "@react-google-maps/api"

interface TripDetailsPageProps {
    params: {
        id: string
    }
}

export default function TripDetailsPage({ params }: TripDetailsPageProps) {
    const [trip, setTrip] = useState<Trip | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [distanceKm, setDistanceKm] = useState<number | null>(null)
    const [durationText, setDurationText] = useState<string | null>(null)

    const { isLoaded } = useJsApiLoader({
        id: "google-map-script",
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
        libraries: ["places"],
    })

    useEffect(() => {
        loadTripDetails()
    }, [params.id])

    const loadTripDetails = async () => {
        try {
            setLoading(true)
            setError(null)
            const response = await getTrip(parseInt(params.id))
            setTrip(response.trip)
        } catch (error) {
            console.error("Error loading trip details:", error)
            setError("No se pudo cargar los detalles del viaje")
        } finally {
            setLoading(false)
        }
    }

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

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    if (error || !trip) {
        return (
            <div className="p-6 w-full">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            Error al cargar el viaje
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            {error || "No se encontró el viaje"}
                        </p>
                        <Link href="/trips">
                            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Volver a Viajes
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="p-6 w-full">
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/trips">
                            <Button variant="outline" size="sm">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Volver
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                Viaje #{trip.trip_id}
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400">
                                Detalles completos del viaje
                            </p>
                        </div>
                    </div>
                    {getStatusBadge(trip.status)}
                </div>

                {/* Información principal */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Detalles del viaje */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5" />
                                Información del Viaje
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Ruta */}
                            <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                <Navigation className="h-5 w-5 text-blue-600" />
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white">
                                        {trip.origin} → {trip.destination}
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Ruta del viaje</p>
                                </div>
                            </div>

                            {/* Fecha */}
                            <div className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                                <Calendar className="h-5 w-5 text-purple-600" />
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white">
                                        {new Date(trip.date).toLocaleDateString("es-ES", {
                                            weekday: "long",
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric"
                                        })}
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {new Date(trip.date).toLocaleTimeString("es-ES", {
                                            hour: "2-digit",
                                            minute: "2-digit"
                                        })}
                                    </p>
                                </div>
                            </div>

                            {/* Estado */}
                            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                <Clock className="h-5 w-5 text-gray-600" />
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white">
                                        Estado: {trip.status}
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Última actualización: {new Date(trip.updated_at).toLocaleString("es-ES")}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Información del camión */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Truck className="h-5 w-5" />
                                Información del Camión
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                                <Truck className="h-5 w-5 text-emerald-600" />
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white">
                                        {trip.truck.plate}
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {trip.truck.brand} {trip.truck.model}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Información del conductor */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                Información del Conductor
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                                <User className="h-5 w-5 text-amber-600" />
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white">
                                        {trip.driver.name} {trip.driver.surname}
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {trip.driver.email}
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Tel: {trip.driver.phone}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Métricas de ruta (en lugar del mapa dentro de la grilla) */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Clock className="h-5 w-5" />
                                Métricas de la Ruta
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
                                    <div className="flex items-center gap-3">
                                        <Navigation className="h-5 w-5 text-blue-600" />
                                        <div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Distancia</p>
                                            <p className="text-xl font-semibold text-gray-900 dark:text-white">
                                                {distanceKm !== null ? `${distanceKm} km` : "Calculando..."}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
                                    <div className="flex items-center gap-3">
                                        <Clock className="h-5 w-5 text-purple-600" />
                                        <div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Duración</p>
                                            <p className="text-xl font-semibold text-gray-900 dark:text-white">
                                                {durationText ?? "Calculando..."}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Mapa de Ruta (pleno ancho) */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <MapPin className="h-5 w-5" />
                            Mapa de Ruta
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {trip.origin && trip.destination && (
                            <div className="rounded-lg overflow-hidden border border-slate-700">
                                <GoogleMaps
                                    isLoaded={isLoaded}
                                    origin={trip.origin}
                                    destination={trip.destination}
                                    height={320}
                                    zoom={12}
                                    onRouteComputed={({ distanceMeters, durationText }) => {
                                        setDistanceKm(distanceMeters ? Math.round(distanceMeters / 100) / 10 : null)
                                        setDurationText(durationText ?? null)
                                    }}
                                />
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Información adicional */}
                <Card>
                    <CardHeader>
                        <CardTitle>Información Adicional</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white">ID del Viaje</p>
                                <p className="text-gray-600 dark:text-gray-400">#{trip.trip_id}</p>
                            </div>
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white">Creado</p>
                                <p className="text-gray-600 dark:text-gray-400">
                                    {new Date(trip.created_at).toLocaleString("es-ES")}
                                </p>
                            </div>
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white">Actualizado</p>
                                <p className="text-gray-600 dark:text-gray-400">
                                    {new Date(trip.updated_at).toLocaleString("es-ES")}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
