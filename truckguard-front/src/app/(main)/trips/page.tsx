"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

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
} from "@/components/alert-dialog"
import {
    Truck,
    Plus,
    Calendar,
    User,
    Navigation,
    CheckCircle,
    AlertCircle,
    PlayCircle,
    Eye,
    Trash2,
    AlertTriangle,
    Search,
    Filter,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
} from "lucide-react"
import { Trip } from "@/types/trips.types"
import { getTrips, updateTrips, deleteTrips, activateTrips } from "@/lib/actions/trips.actions"
import Link from "next/link"
import { Toaster, toast } from "react-hot-toast"
import LoadingSpinner from "@/components/ui/loading-spinner"

export default function TripsPage() {
    const ENABLE_DELETE = process.env.NEXT_PUBLIC_ENABLE_DELETE === "true"
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [tripToDelete, setTripToDelete] = useState<number | null>(null)

    // Estados para los datos reales
    const [tripsData, setTripsData] = useState<{
        trips: Trip[]
        total: number
        pages: number
        page: number
    }>({
        trips: [],
        total: 0,
        pages: 0,
        page: 1
    })
    const [loading, setLoading] = useState(true)

    // Estados para filtros y paginación
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(5)
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState<string>("all")
    const [dateFilter, setDateFilter] = useState<string>("all")

    // Cargar datos al montar el componente
    useEffect(() => {
        loadTrips()
    }, [currentPage, itemsPerPage])

    const loadTrips = async () => {
        try {
            setLoading(true)
            const data = await getTrips(currentPage, itemsPerPage)
            setTripsData(data)
        } catch (error) {
            console.error("Error loading trips:", error)
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
            case "In Course":
                return (
                    <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                        <PlayCircle className="h-3 w-3 mr-1" />
                        En curso
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

    const handleStatusChange = async (tripId: number, newStatus: string) => {
        try {
            await toast.promise(
                updateTrips(tripId),
                {
                    loading: "Completando viaje...",
                    success: "Viaje completado",
                    error: "Error completando el viaje",
                }
            )
            await loadTrips()
        } catch (error) {
            console.error("Error updating trip status:", error)
        }
    }

    const handleActivate = async (tripId: number) => {
        try {
            await toast.promise(
                activateTrips(tripId),
                {
                    loading: "Activando viaje...",
                    success: "Viaje en curso",
                    error: "Error activando el viaje",
                }
            )
            await loadTrips()
        } catch (error) {
            console.error("Error activating trip:", error)
        }
    }

    const handleDeleteTrip = async (tripId: number) => {
        try {
            await toast.promise(
                deleteTrips(tripId),
                {
                    loading: "Eliminando viaje...",
                    success: "Viaje eliminado",
                    error: "Error eliminando el viaje",
                }
            )
            await loadTrips()
        } catch (error) {
            console.error("Error deleting trip:", error)
        }
    }

    const handleViewDetails = (trip: Trip) => {
        // Simulando datos completos del backend
        window.location.href = `/trips/${trip.trip_id}`
    }

    const getActionButtons = (trip: Trip) => {
        const buttons = []

        if (trip.status === "Pending") {
            buttons.push(
                <Button
                    key="activate"
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => handleActivate(trip.trip_id)}
                >
                    <PlayCircle className="h-3 w-3 mr-1" />
                    Activar
                </Button>
            )
        }

        if (trip.status === "In Course") {
            buttons.push(
                <Button
                    key="complete"
                    size="sm"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    onClick={() => handleStatusChange(trip.trip_id, "Completed")}
                >
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Completar
                </Button>
            )
        }

        return buttons
    }

    // Función para filtrar viajes (filtrado local para la página actual)
    const filteredTrips = tripsData.trips.filter((trip) => {
        const matchesSearch = searchTerm === "" ||
            trip.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
            trip.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
            trip.driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            trip.driver.surname.toLowerCase().includes(searchTerm.toLowerCase()) ||
            trip.truck.plate.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesStatus = statusFilter === "all" || trip.status === statusFilter

        const matchesDate = dateFilter === "all" || (() => {
            const tripDate = new Date(trip.date)
            const today = new Date()
            const yesterday = new Date(today)
            yesterday.setDate(yesterday.getDate() - 1)
            const lastWeek = new Date(today)
            lastWeek.setDate(lastWeek.getDate() - 7)
            const lastMonth = new Date(today)
            lastMonth.setMonth(lastMonth.getMonth() - 1)

            switch (dateFilter) {
                case "today":
                    return tripDate.toDateString() === today.toDateString()
                case "yesterday":
                    return tripDate.toDateString() === yesterday.toDateString()
                case "lastWeek":
                    return tripDate >= lastWeek
                case "lastMonth":
                    return tripDate >= lastMonth
                default:
                    return true
            }
        })()

        return matchesSearch && matchesStatus && matchesDate
    })

    // Usar datos del backend para paginación
    const totalFilteredTrips = tripsData.total
    const totalPages = tripsData.pages
    const currentTrips = filteredTrips

    // Función para cambiar página
    const goToPage = (page: number) => {
        setCurrentPage(Math.max(1, Math.min(page, totalPages)))
    }

    // Función para limpiar filtros
    const clearFilters = () => {
        setSearchTerm("")
        setStatusFilter("all")
        setDateFilter("all")
        setCurrentPage(1)
    }

    if (loading) {
        return <LoadingSpinner message="Cargando página..." size="lg" />
    }

    return (
        <div className="flex-1 overflow-auto p-6 bg-gradient-to-r from-slate-900 via-gray-900 to-slate-800 min-h-screen">
            <Toaster position="top-center" reverseOrder={false} />
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header con título y botón crear */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-bold text-white">🚛 Gestión de Viajes</h2>
                        <p className="text-slate-300 mt-1">
                            Total de viajes: {tripsData.total} | Página {currentPage} de {totalPages} | {currentTrips.length} viajes en esta página
                        </p>
                    </div>
                    <Link href="/trips/create">
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                            <Plus className="h-4 w-4 mr-2" />
                            Crear Viaje
                        </Button>
                    </Link>
                </div>

                {/* Filtros */}
                <Card className="bg-slate-800/50 border-slate-700">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-white">
                            <Filter className="h-5 w-5" />
                            Filtros y Búsqueda
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            {/* Búsqueda */}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input
                                    placeholder="Buscar viajes..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500"
                                />
                            </div>

                            {/* Filtro por estado */}
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="flex h-10 w-full items-center justify-between rounded-md border border-slate-600 bg-slate-700/50 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="all">Todos los estados</option>
                                <option value="Pending">Pendiente</option>
                                <option value="In Course">En curso</option>
                                <option value="Completed">Completado</option>
                            </select>

                            {/* Filtro por fecha */}
                            <select
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value)}
                                className="flex h-10 w-full items-center justify-between rounded-md border border-slate-600 bg-slate-700/50 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="all">Todas las fechas</option>
                                <option value="today">Hoy</option>
                                <option value="yesterday">Ayer</option>
                                <option value="lastWeek">Última semana</option>
                                <option value="lastMonth">Último mes</option>
                            </select>

                            {/* Botón limpiar filtros */}
                            <Button
                                variant="outline"
                                onClick={clearFilters}
                                className="w-full border-blue-700 text-slate-100 hover:bg-slate-700/30 hover:text-white bg-transparent"
                            >
                                Limpiar Filtros
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Lista de viajes */}
                <div className="grid gap-4">
                    {currentTrips.map((trip) => (
                        <Card
                            key={trip.trip_id}
                            className="hover:shadow-lg transition-all duration-200 hover:scale-[1.01] border-0 shadow-sm bg-slate-800/50 border-slate-700"
                        >
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg font-semibold text-white">
                                        Viaje #{trip.trip_id}
                                    </CardTitle>
                                    {getStatusBadge(trip.status)}
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                                    {/* Ruta */}
                                    <div className="flex items-center gap-2">
                                        <Navigation className="h-4 w-4 text-blue-400" />
                                        <div>
                                            <p className="text-sm font-medium text-white">
                                                {trip.origin} → {trip.destination}
                                            </p>
                                            <p className="text-xs text-slate-400">Ruta</p>
                                        </div>
                                    </div>

                                    {/* Camión */}
                                    <div className="flex items-center gap-2">
                                        <Truck className="h-4 w-4 text-emerald-400" />
                                        <div>
                                            <p className="text-sm font-medium text-white">{trip.truck.plate}</p>
                                            <p className="text-xs text-slate-400">
                                                {trip.truck.brand} {trip.truck.model}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Conductor */}
                                    <div className="flex items-center gap-2">
                                        <User className="h-4 w-4 text-amber-400" />
                                        <div>
                                            <p className="text-sm font-medium text-white">
                                                {trip.driver.name} {trip.driver.surname}
                                            </p>
                                            <p className="text-xs text-slate-400">Conductor</p>
                                        </div>
                                    </div>

                                    {/* Fecha */}
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-purple-400" />
                                        <div>
                                            <p className="text-sm font-medium text-white">
                                                {new Date(trip.date).toLocaleDateString("es-ES")}
                                            </p>
                                            <p className="text-xs text-slate-400">
                                                {new Date(trip.date).toLocaleTimeString("es-ES", {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleViewDetails(trip)}
                                            className="text-blue-400 border-blue-700 hover:bg-blue-900/30 hover:text-white bg-transparent"
                                        >
                                            <Eye className="h-3 w-3 mr-1" />
                                            Ver Detalles
                                        </Button>
                                        {getActionButtons(trip)}
                                    </div>

                                    {trip.status === "Completed" && ENABLE_DELETE && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                setTripToDelete(trip.trip_id)
                                                setDeleteDialogOpen(true)
                                            }}
                                            className="text-red-400 border-slate-600 hover:bg-red-900/20 hover:text-white bg-transparent"
                                        >
                                            <Trash2 className="h-3 w-3 mr-1" />
                                            Eliminar
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Paginación */}
                {totalPages > 1 && (
                    <Card className="bg-slate-800/50 border-slate-700">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-slate-300">
                                    Mostrando {((currentPage - 1) * itemsPerPage) + 1} a {Math.min(currentPage * itemsPerPage, totalFilteredTrips)} de {totalFilteredTrips} viajes
                                </div>

                                <div className="flex items-center gap-2">
                                    {/* Botones de navegación */}
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => goToPage(1)}
                                        disabled={currentPage === 1}
                                        className="border-slate-600 text-slate-300 hover:bg-slate-700/50 hover:text-white"
                                    >
                                        <ChevronsLeft className="h-4 w-4" />
                                    </Button>

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => goToPage(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="border-slate-600 text-slate-300 hover:bg-slate-700/50 hover:text-white"
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </Button>

                                    {/* Números de página */}
                                    <div className="flex items-center gap-1">
                                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                            let pageNum
                                            if (totalPages <= 5) {
                                                pageNum = i + 1
                                            } else if (currentPage <= 3) {
                                                pageNum = i + 1
                                            } else if (currentPage >= totalPages - 2) {
                                                pageNum = totalPages - 4 + i
                                            } else {
                                                pageNum = currentPage - 2 + i
                                            }

                                            return (
                                                <Button
                                                    key={pageNum}
                                                    variant={currentPage === pageNum ? "default" : "outline"}
                                                    size="sm"
                                                    onClick={() => goToPage(pageNum)}
                                                    className={`w-8 h-8 p-0 ${currentPage === pageNum
                                                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                                                        : "border-slate-600 text-slate-300 hover:bg-slate-700/50 hover:text-white"
                                                        }`}
                                                >
                                                    {pageNum}
                                                </Button>
                                            )
                                        })}
                                    </div>

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => goToPage(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className="border-slate-600 text-slate-300 hover:bg-slate-700/50 hover:text-white"
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => goToPage(totalPages)}
                                        disabled={currentPage === totalPages}
                                        className="border-slate-600 text-slate-300 hover:bg-slate-700/50 hover:text-white"
                                    >
                                        <ChevronsRight className="h-4 w-4" />
                                    </Button>
                                </div>

                                {/* Selector de items por página */}
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-slate-300">Mostrar:</span>
                                    <select
                                        value={itemsPerPage.toString()}
                                        onChange={(e) => {
                                            setItemsPerPage(parseInt(e.target.value))
                                            setCurrentPage(1)
                                        }}
                                        className="w-20 h-8 rounded-md border border-slate-600 bg-slate-700/50 px-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="5">5</option>
                                        <option value="10">10</option>
                                        <option value="20">20</option>
                                        <option value="50">50</option>
                                    </select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div >
    )
}