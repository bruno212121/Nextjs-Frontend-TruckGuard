import { getFleetAnalytics, getPendingMaintenances, refreshFleetAnalytics } from "@/lib/actions/fleetanalytics.actions"
import { DashboardHeader, MetricsCards } from "@/components/dashboard"

export default async function Dashboard() {
    try {
        // Primero hacer refresh de los datos del backend
        await refreshFleetAnalytics()

        // Luego obtener los datos actualizados
        const [fleetAnalytics, pendingMaintenances] = await Promise.all([
            getFleetAnalytics(),
            getPendingMaintenances()
        ])

        return (
            <div className="flex-1 overflow-auto p-6 bg-gradient-to-r from-slate-900 via-gray-900 to-slate-800 min-h-screen">
                <DashboardHeader lastUpdated={fleetAnalytics.updated_at} />
                <MetricsCards data={fleetAnalytics} pendingCount={pendingMaintenances.total_pending} />
            </div>
        )
    } catch (error) {
        console.error("Error loading dashboard:", error)

        // Si hay error, intentar cargar datos sin refresh
        try {
            const [fleetAnalytics, pendingMaintenances] = await Promise.all([
                getFleetAnalytics(),
                getPendingMaintenances()
            ])

            return (
                <div className="flex-1 overflow-auto p-6 bg-gradient-to-r from-slate-900 via-gray-900 to-slate-800 min-h-screen">
                    <DashboardHeader lastUpdated={fleetAnalytics.updated_at} />
                    <MetricsCards data={fleetAnalytics} pendingCount={pendingMaintenances.total_pending} />
                </div>
            )
        } catch (fallbackError) {
            console.error("Error loading dashboard with fallback:", fallbackError)

            return (
                <div className="flex-1 overflow-auto p-6 bg-gradient-to-r from-slate-900 via-gray-900 to-slate-800 min-h-screen">
                    <div className="flex items-center justify-center h-64">
                        <div className="text-center">
                            <h2 className="text-xl font-semibold text-white mb-2">Error al cargar el dashboard</h2>
                            <p className="text-slate-300">Por favor, intenta recargar la página</p>
                        </div>
                    </div>
                </div>
            )
        }
    }
}
