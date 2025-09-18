"use client"

import { Button } from "@/components/ui/button"
import { Truck, Users, MapPin, Activity, LogOut, Sun, Moon } from "lucide-react"
import { useTheme } from "next-themes"
import Link from "next/link"
import { usePathname, useRouter } from 'next/navigation'
import { logout } from "@/lib/actions/auth.actions"
import { useState } from "react"

export default function SidebarNav() {
    const { theme, setTheme } = useTheme()
    const pathname = usePathname()
    const router = useRouter()
    const [isLoggingOut, setIsLoggingOut] = useState(false)

    // Determinar la sección activa basada en la ruta actual
    const getActiveSection = () => {
        if (pathname.startsWith('/dashboard')) return 'dashboard'
        if (pathname.startsWith('/trips')) return 'trips'
        if (pathname.startsWith('/trucks')) return 'trucks'
        if (pathname.startsWith('/drivers')) return 'drivers'
        return 'dashboard'
    }

    const activeSection = getActiveSection()

    // Función para cerrar sesión
    const handleLogout = async () => {
        setIsLoggingOut(true)
        try {
            await logout()
            // Redirigir a la página de login
            router.push('/')
        } catch (error) {
            console.error('Error al cerrar sesión:', error)
            // Aún así redirigir al login en caso de error
            router.push('/')
        } finally {
            setIsLoggingOut(false)
        }
    }

    return (
        <div className="fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-slate-800 to-gray-800 border-r border-slate-700 shadow-xl lg:static lg:inset-0">
            <div className="flex flex-col h-full">
                {/* Logo y título */}
                <div className="flex items-center gap-3 p-6 border-b border-slate-700">
                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center shadow-md">
                        <Truck className="h-6 w-6 text-slate-800" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-white">TruckGuard</h1>
                        <p className="text-xs text-slate-300">Gestión inteligente de flota</p>
                    </div>
                </div>

                {/* Mensaje de bienvenida */}
                <div className="p-4 border-b border-slate-700 bg-slate-700/50">
                    <p className="text-sm text-slate-300">Bienvenido,</p>
                    <p className="font-semibold text-white">Juan Pérez</p>
                </div>

                {/* Navegación */}
                <nav className="flex-1 p-4 space-y-2">
                    {[
                        { id: "dashboard", label: "Dashboard", icon: Activity, href: "/dashboard" },
                        { id: "trips", label: "Gestionar Viajes", icon: MapPin, href: "/trips" },
                        { id: "trucks", label: "Gestionar Camiones", icon: Truck, href: "/trucks" },
                        { id: "drivers", label: "Gestión de Conductores", icon: Users, href: "/drivers" },
                    ].map((item) => (
                        <Link key={item.id} href={item.href}>
                            <Button
                                variant={activeSection === item.id ? "default" : "ghost"}
                                className={`w-full justify-start gap-3 ${activeSection === item.id
                                    ? "bg-slate-100 text-slate-800 hover:bg-white"
                                    : "text-slate-300 hover:bg-slate-700/50 hover:text-white"
                                    }`}
                            >
                                {item.icon && <item.icon className="h-4 w-4" />}
                                {item.label}
                            </Button>
                        </Link>
                    ))}
                </nav>


                <div className="p-4 border-t border-slate-700 space-y-2">
                    <Button
                        variant="outline"
                        className="w-full justify-start gap-3 text-slate-300 border-slate-600 hover:bg-red-900/30 hover:text-red-400 hover:border-red-600 bg-transparent"
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                    >
                        <LogOut className="h-4 w-4" />
                        {isLoggingOut ? "Cerrando..." : "Cerrar Sesión"}
                    </Button>
                </div>
            </div>
        </div>
    )
}