import { getFleetAnalytics } from "@/lib/actions/fleetanalytics.actions"
import { DashboardHeader, MetricsCards } from "@/components/dashboard"

export default async function Dashboard() {
    const fleetAnalytics = await getFleetAnalytics()

    return (
        <div className="flex-1 overflow-auto p-6 bg-gradient-to-r from-slate-900 via-gray-900 to-slate-800 min-h-screen">
            <DashboardHeader lastUpdated={fleetAnalytics.updated_at} />
            <MetricsCards data={fleetAnalytics} />
        </div>
    )
}
