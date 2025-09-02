import { getFleetAnalytics } from "@/lib/actions/fleetanalytics.actions"
import { DashboardHeader, MetricsCards } from "@/components/dashboard"

export default async function Dashboard() {
    const fleetAnalytics = await getFleetAnalytics()

    return (
        <div className="p-6 w-full">
            <DashboardHeader lastUpdated={fleetAnalytics.updated_at} />
            <MetricsCards data={fleetAnalytics} />
        </div>
    )
}
