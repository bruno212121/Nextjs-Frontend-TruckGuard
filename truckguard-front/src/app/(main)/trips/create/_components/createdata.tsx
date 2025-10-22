"use client"

import React, { useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Route, Clock, User, Truck, Mail, Phone } from "lucide-react"
import { Toaster, toast } from "react-hot-toast"
import Link from "next/link"
import GoogleMaps from "@/components/google/google-maps"
import { useJsApiLoader } from "@react-google-maps/api"

interface TripData {
    trip_id: number
    origin: string
    destination: string
    status: string
    distance: number
    duration: string
    driver: {
        name: string
        email: string
        phone: string
    }
    truck: {
        brand: string
        model: string
        plate: string
        year: number
    }
    created_at: string
    risk_warnings?: Array<{
        component: string
        current_status: string
        current_km: number
        projected_km: number
        projected_percentage: number
        risk_level: 'HIGH' | 'MEDIUM'
    }>
    risk_warning_message?: string
    recommendation?: string
}

interface TripConfirmationProps {
    tripData: TripData
    onCreateAnother: () => void
}

export function TripConfirmation({ tripData, onCreateAnother }: TripConfirmationProps) {
    const { isLoaded } = useJsApiLoader({
        id: "google-map-script",
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
        libraries: ["places"],
    })
    const [distanceKm, setDistanceKm] = React.useState<number | null>(null)
    const [durationText, setDurationText] = React.useState<string | null>(null)

    // Mostrar notificación cuando se monta el componente
    useEffect(() => {
        toast.success("Viaje creado exitosamente")

        // Mostrar advertencias de riesgo si existen
        if (tripData.risk_warnings && tripData.risk_warnings.length > 0) {
            // Agrupar advertencias por nivel de riesgo
            const highRiskComponents = tripData.risk_warnings.filter(w => w.risk_level === 'HIGH')
            const mediumRiskComponents = tripData.risk_warnings.filter(w => w.risk_level === 'MEDIUM')

            // Mostrar advertencia de alto riesgo
            if (highRiskComponents.length > 0) {
                const componentNames = highRiskComponents.map(c => c.component).join(', ')
                toast.error(
                    `🚨 ALTO RIESGO: Los siguientes componentes llegarán al 100% o más durante el viaje y tienen MUY ALTA probabilidad de fallar: ${componentNames}`,
                    {
                        duration: 8000,
                        style: {
                            background: '#dc2626',
                            color: 'white',
                            fontWeight: 'bold'
                        }
                    }
                )
            }

            // Mostrar advertencia de riesgo medio
            if (mediumRiskComponents.length > 0) {
                const componentNames = mediumRiskComponents.map(c => c.component).join(', ')
                toast.error(
                    `⚠️ RIESGO MEDIO: Los siguientes componentes llegarán al 80% o más durante el viaje: ${componentNames}`,
                    {
                        duration: 6000,
                        style: {
                            background: '#f59e0b',
                            color: 'white',
                            fontWeight: 'bold'
                        }
                    }
                )
            }

            // Mostrar recomendación si existe
            if (tripData.recommendation) {
                setTimeout(() => {
                    toast(tripData.recommendation!, {
                        duration: 10000,
                        icon: '🔧',
                        style: {
                            background: '#3b82f6',
                            color: 'white',
                            fontWeight: 'bold'
                        }
                    })
                }, 2000)
            }
        }
    }, [tripData])

    return (
        <div className="min-h-screen bg-gradient-to-r from-slate-900 via-gray-900 to-slate-800 p-6">
            <Toaster position="top-center" reverseOrder={false} />
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Mensaje de éxito - estilo de page.tsx */}
                <Card className="bg-slate-800/50 border-slate-700 shadow-xl">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-2">
                            <CheckCircle className="h-6 w-6 text-green-400" />
                            <h3 className="text-lg font-semibold text-white">¡Viaje creado exitosamente!</h3>
                        </div>
                    </CardContent>
                </Card>

                {/* Advertencias de riesgo - si existen */}
                {tripData.risk_warnings && tripData.risk_warnings.length > 0 && (
                    <Card className="bg-slate-800/50 border-slate-700 shadow-xl">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                                <span className="text-red-400">⚠️</span>
                                Advertencias de Riesgo
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {tripData.risk_warnings.map((warning, index) => (
                                <div key={index} className={`p-4 rounded-lg border ${warning.risk_level === 'HIGH'
                                    ? 'bg-red-900/20 border-red-500/50'
                                    : 'bg-yellow-900/20 border-yellow-500/50'
                                    }`}>
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className={`font-semibold ${warning.risk_level === 'HIGH' ? 'text-red-300' : 'text-yellow-300'
                                            }`}>
                                            {warning.risk_level === 'HIGH' ? '🚨 ALTO RIESGO' : '⚠️ RIESGO MEDIO'}: {warning.component}
                                        </h4>
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${warning.risk_level === 'HIGH'
                                            ? 'bg-red-600 text-white'
                                            : 'bg-yellow-600 text-white'
                                            }`}>
                                            {warning.risk_level}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <p className="text-slate-400">Estado actual:</p>
                                            <p className="text-white">{warning.current_status}</p>
                                        </div>
                                        <div>
                                            <p className="text-slate-400">KM actual:</p>
                                            <p className="text-white">{warning.current_km.toLocaleString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-slate-400">KM proyectado:</p>
                                            <p className="text-white">{warning.projected_km.toLocaleString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-slate-400">% de uso:</p>
                                            <p className={`font-semibold ${warning.projected_percentage >= 100 ? 'text-red-400' : 'text-yellow-400'
                                                }`}>
                                                {warning.projected_percentage.toFixed(1)}%
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {tripData.recommendation && (
                                <div className="mt-4 p-4 bg-blue-900/20 border border-blue-500/50 rounded-lg">
                                    <div className="flex items-start gap-2">
                                        <span className="text-blue-400">🔧</span>
                                        <div>
                                            <p className="text-blue-300 font-medium">Recomendación:</p>
                                            <p className="text-white">{tripData.recommendation}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* Mapa de ruta - contenedor igual al de page.tsx */}
                <div className="rounded-lg overflow-hidden border border-slate-700">
                    <GoogleMaps
                        isLoaded={isLoaded}
                        origin={tripData.origin}
                        destination={tripData.destination}
                        height={256}
                        zoom={12}
                        onRouteComputed={({ distanceMeters, distanceText, durationText }) => {
                            setDistanceKm(distanceMeters ? Math.round(distanceMeters / 100) / 10 : null)
                            setDurationText(durationText ?? null)
                        }}
                    />
                </div>

                {/* Detalles del viaje */}
                <Card className="bg-slate-800/50 border-slate-700 shadow-xl">
                    <CardHeader>
                        <CardTitle className="text-white">Detalles del Viaje:</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm text-slate-300">ID del Viaje:</p>
                                    <p className="text-lg font-semibold text-white">{tripData.trip_id}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-300">Origen:</p>
                                    <p className="text-lg text-white">{tripData.origin}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-300">Destino:</p>
                                    <p className="text-lg text-white">{tripData.destination}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-300">Estado:</p>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-700/50 text-slate-300 border border-slate-600">
                                        <span className="text-white">{tripData.status}</span>
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm text-slate-300 flex items-center gap-2">
                                        <Route className="h-4 w-4" />
                                        Distancia:
                                    </p>
                                    <p className="text-lg text-white">{distanceKm ?? tripData.distance} {distanceKm !== null ? "km" : "km"}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-300 flex items-center gap-2">
                                        <Clock className="h-4 w-4" />
                                        Duración:
                                    </p>
                                    <p className="text-lg text-white">{durationText ?? tripData.duration}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-300 flex items-center gap-2">
                                        <User className="h-4 w-4" />
                                        Conductor:
                                    </p>
                                    <p className="text-lg text-white">{tripData.driver.name}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-300 flex items-center gap-2">
                                        <Truck className="h-4 w-4" />
                                        Camión:
                                    </p>
                                    <p className="text-lg text-white">
                                        {tripData.truck.brand} {tripData.truck.model} (Año: {tripData.truck.year})
                                    </p>
                                    <p className="text-sm text-slate-300">
                                        <span className="text-white">Patente: {tripData.truck.plate}</span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 pt-6 border-t border-slate-700">
                            <Link href="/trips" className="flex-1">
                                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">Ver Todos los Viajes</Button>
                            </Link>
                            <Button
                                onClick={onCreateAnother}
                                variant="outline"
                                className="flex-1 bg-transparent border-slate-600 text-slate-300 hover:bg-slate-700"
                            >
                                Crear Otro Viaje
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
