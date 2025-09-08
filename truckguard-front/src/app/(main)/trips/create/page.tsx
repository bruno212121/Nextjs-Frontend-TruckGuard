"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { useTheme } from "next-themes"
import type { Truck as TruckType, Driver } from "@/types/trucks.types"
import type { CreateTripRequest } from "@/types/trips.types"
import { createTrips } from "@/lib/actions/trips.actions"
import { getTrucks } from "@/lib/actions/truck.actions"
import GoogleMaps from "@/components/google/google-maps"
import { Autocomplete, useJsApiLoader } from "@react-google-maps/api"
import {
    Truck,
    Users,
    MapPin,
    Activity,
    LogOut,
    Menu,
    Sun,
    Moon,
    ArrowLeft,
    Navigation,
    User,
    Calendar,
} from "lucide-react"
// datos de los camiones y conductores

// Datos para el formulario


export default function CreateTripPage() {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [activeSection, setActiveSection] = useState("trips")
    const { theme, setTheme } = useTheme()

    // Estados para los datos del backend
    const [availableTrucks, setAvailableTrucks] = useState<TruckType[]>([])
    const [availableDrivers, setAvailableDrivers] = useState<Driver[]>([])
    const [loading, setLoading] = useState(true)

    // Estados del formulario
    const [formData, setFormData] = useState({
        origin: "",
        destination: "",
        truck_id: "",
        driver_id: "",
        status: "Pending" as const,
        date: "",
    })

    const { isLoaded } = useJsApiLoader({
        id: "google-map-script",
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
        libraries: ["places"],
    })

    const originRef = useRef<HTMLInputElement>(null)
    const destinationRef = useRef<HTMLInputElement>(null)



    // Cargar datos del backend
    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true)
                // Cargar camiones
                const trucksResponse = await getTrucks(1, 100)

                if (trucksResponse.trucks) {
                    // Filtrar camiones que tengan conductor asignado
                    const trucksWithDriver = trucksResponse.trucks.filter(truck =>
                        truck.driver && truck.driver.id
                    )

                    setAvailableTrucks(trucksWithDriver)

                    // Setear valores por defecto si hay camiones disponibles
                    if (trucksWithDriver.length > 0) {
                        const t0 = trucksWithDriver[0]

                        const initialData = {
                            ...formData,
                            truck_id: String(t0.truck_id),
                            driver_id: String(t0.driver.id),
                        }

                        setFormData(initialData)
                    }
                }
                setAvailableDrivers([])
            } catch (error) {
                console.error("Error al cargar datos:", error)
            } finally {
                setLoading(false)
            }
        }

        loadData()
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // Validar que ambos IDs estén presentes
        if (!formData.truck_id || !formData.driver_id) {
            alert("Error: Debes seleccionar un camión válido")
            return
        }

        const tripData: CreateTripRequest = {
            origin: formData.origin,
            destination: formData.destination,
            truck_id: Number(formData.truck_id),
            driver_id: Number(formData.driver_id),
            status: formData.status,
            date: formData.date,
        }

        try {
            await createTrips(tripData)
            // Guardar datos mínimos para pantalla de confirmación
            const selectedTruck = availableTrucks.find(t => String(t.truck_id) === formData.truck_id)
            const createdTrip = {
                trip_id: Date.now(),
                origin: tripData.origin,
                destination: tripData.destination,
                status: tripData.status,
                distance: 0,
                duration: "",
                driver: {
                    name: selectedTruck?.driver ? `${selectedTruck.driver.name}` : "",
                    email: "",
                    phone: "",
                },
                truck: {
                    brand: selectedTruck?.brand || "",
                    model: selectedTruck?.model || "",
                    plate: selectedTruck?.plate || "",
                    year: selectedTruck?.year || 0,
                },
                created_at: new Date().toISOString(),
            }
            try { localStorage.setItem("created_trip", JSON.stringify(createdTrip)) } catch { }
            // Redirigir a confirmación
            window.location.href = "/trips/create/createdata"
        } catch (error) {
            console.error("Error al crear el viaje:", error)
        }
    }



    // Vista previa con Google Maps

    return (
        <div className="flex h-screen bg-gradient-to-r from-slate-900 via-gray-900 to-slate-800">
            {/* Sidebar */}

            {/* Contenido principal */}
            <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
                {/* Header móvil */}
                <div className="lg:hidden flex items-center justify-between p-4 border-b border-slate-700 bg-slate-800/90 backdrop-blur-sm shadow-lg">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="text-slate-300 hover:text-white hover:bg-slate-700/50"
                    >
                        <Menu className="h-5 w-5" />
                    </Button>
                    <h1 className="text-lg font-semibold text-white">Crear Viaje</h1>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        className="text-slate-300 hover:text-white hover:bg-slate-700/50"
                    >
                        {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                    </Button>
                </div>

                {/* Área principal */}
                <main className="flex-1 overflow-auto p-6">
                    <div className="max-w-4xl mx-auto space-y-6">
                        {/* Header con botón volver */}
                        <div className="flex items-center gap-4">
                            <Link href="/trips">
                                <Button
                                    variant="outline"
                                    className="text-slate-300 border-slate-600 hover:bg-slate-700/50 hover:text-white bg-transparent"
                                >
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    Volver a Viajes
                                </Button>
                            </Link>
                            <div>
                                <h2 className="text-2xl font-bold text-white text-balance">🚛 Crear Nuevo Viaje</h2>
                                <p className="text-slate-300 mt-1">Complete los datos del viaje y visualice la ruta</p>
                            </div>
                        </div>

                        {/* Formulario */}
                        <Card className="bg-slate-800/50 border-slate-700 shadow-xl">
                            <CardHeader>
                                <CardTitle className="text-white">Información del Viaje</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {loading ? (
                                    <div className="flex items-center justify-center py-8">
                                        <div className="text-slate-400">Cargando datos...</div>
                                    </div>
                                ) : availableTrucks.length === 0 ? (
                                    <div className="flex items-center justify-center py-8">
                                        <div className="text-center">
                                            <Truck className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                                            <div className="text-slate-400 text-lg font-medium">No hay camiones disponibles</div>
                                            <div className="text-slate-500 text-sm mt-2">Todos los camiones deben tener un conductor asignado</div>
                                        </div>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="origin" className="text-slate-200 flex items-center gap-2">
                                                    <MapPin className="h-4 w-4 text-blue-400" />
                                                    Origen
                                                </Label>
                                                {isLoaded ? (
                                                    <Autocomplete
                                                        onPlaceChanged={() => {
                                                            const place = (originRef.current as any)?.autocomplete?.getPlace?.()
                                                            const p = (originRef.current as HTMLInputElement | null)?.value || ""
                                                            const formatted = (place?.formatted_address ?? p) as string
                                                            setFormData(prev => ({ ...prev, origin: formatted }))
                                                        }}
                                                        onLoad={(ac) => {
                                                            ; (originRef.current as any).autocomplete = ac
                                                        }}
                                                    >
                                                        <input
                                                            id="origin"
                                                            ref={originRef}
                                                            defaultValue={formData.origin}
                                                            placeholder="Escribe una dirección o ciudad"
                                                            required
                                                            className="w-full h-10 rounded-md bg-slate-700 border border-slate-600 px-3 text-white placeholder:text-slate-400"
                                                        />
                                                    </Autocomplete>
                                                ) : (
                                                    <Input
                                                        id="origin"
                                                        value={formData.origin}
                                                        onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                                                        placeholder="Escribe una dirección o ciudad"
                                                        required
                                                        className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                                                    />
                                                )}
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="destination" className="text-slate-200 flex items-center gap-2">
                                                    <Navigation className="h-4 w-4 text-emerald-400" />
                                                    Destino
                                                </Label>
                                                {isLoaded ? (
                                                    <Autocomplete
                                                        onPlaceChanged={() => {
                                                            const place = (destinationRef.current as any)?.autocomplete?.getPlace?.()
                                                            const p = (destinationRef.current as HTMLInputElement | null)?.value || ""
                                                            const formatted = (place?.formatted_address ?? p) as string
                                                            setFormData(prev => ({ ...prev, destination: formatted }))
                                                        }}
                                                        onLoad={(ac) => {
                                                            ; (destinationRef.current as any).autocomplete = ac
                                                        }}
                                                    >
                                                        <input
                                                            id="destination"
                                                            ref={destinationRef}
                                                            defaultValue={formData.destination}
                                                            placeholder="Escribe una dirección o ciudad"
                                                            required
                                                            className="w-full h-10 rounded-md bg-slate-700 border border-slate-600 px-3 text-white placeholder:text-slate-400"
                                                        />
                                                    </Autocomplete>
                                                ) : (
                                                    <Input
                                                        id="destination"
                                                        value={formData.destination}
                                                        onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                                                        placeholder="Escribe una dirección o ciudad"
                                                        required
                                                        className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                                                    />
                                                )}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="truck" className="text-slate-200 flex items-center gap-2">
                                                    <Truck className="h-4 w-4 text-amber-400" />
                                                    Camión
                                                </Label>
                                                <Select
                                                    value={formData.truck_id}
                                                    onValueChange={(value) => {
                                                        const selectedTruck = availableTrucks.find(t => String(t.truck_id) === value)

                                                        if (selectedTruck && selectedTruck.driver && selectedTruck.driver.id !== undefined) {
                                                            const newDriverId = String(selectedTruck.driver.id)

                                                            setFormData(prev => ({
                                                                ...prev,
                                                                truck_id: value,
                                                                driver_id: newDriverId
                                                            }))
                                                        }
                                                    }}
                                                >
                                                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-slate-800 border-slate-600">
                                                        {availableTrucks.map((truck) => (
                                                            <SelectItem
                                                                key={truck.truck_id}
                                                                value={truck.truck_id?.toString() || ""}
                                                                className="text-slate-100 hover:bg-slate-700 hover:text-white focus:bg-slate-700 focus:text-white"
                                                            >
                                                                {truck.plate} - {truck.brand} {truck.model}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="driver" className="text-slate-200 flex items-center gap-2">
                                                    <User className="h-4 w-4 text-purple-400" />
                                                    Conductor
                                                </Label>
                                                <Input
                                                    id="driver"
                                                    value={
                                                        (() => {
                                                            const selectedTruck = availableTrucks.find(t => String(t.truck_id) === formData.truck_id)

                                                            if (selectedTruck?.driver) {
                                                                return `${selectedTruck.driver.name} ${selectedTruck.driver.surname}`
                                                            } else {
                                                                return "Selecciona un camión primero"
                                                            }
                                                        })()
                                                    }
                                                    readOnly
                                                    disabled
                                                    className="bg-slate-700 border-slate-600 text-slate-200 placeholder:text-slate-400"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="date" className="text-slate-200 flex items-center gap-2">
                                                <Calendar className="h-4 w-4 text-pink-400" />
                                                Fecha y Hora
                                            </Label>
                                            <Input
                                                id="date"
                                                type="datetime-local"
                                                value={formData.date}
                                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                                required
                                                className="bg-slate-700 border-slate-600 text-white"
                                            />
                                        </div>

                                        {/* Mapa de ruta */}
                                        {formData.origin && formData.destination && (
                                            <div className="space-y-2">
                                                <Label className="text-slate-200">Vista previa de ruta</Label>
                                                <div className="rounded-lg overflow-hidden border border-slate-700">
                                                    <GoogleMaps
                                                        isLoaded={isLoaded}
                                                        origin={formData.origin}
                                                        destination={formData.destination}
                                                        height={256}
                                                        zoom={12}
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex gap-4 pt-6">
                                            <Link href="/trips" className="flex-1">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    className="w-full bg-transparent border-slate-600 text-slate-300 hover:bg-slate-700"
                                                >
                                                    Cancelar
                                                </Button>
                                            </Link>
                                            <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                                                Crear Viaje
                                            </Button>
                                        </div>
                                    </form>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </main>
            </div>

            {/* Overlay para móvil */}
            {sidebarOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
            )}
        </div>
    )
}