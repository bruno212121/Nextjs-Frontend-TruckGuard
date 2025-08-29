import { getFleetAnalytics } from "@/lib/actions/fleetanalytics.actions"

export default async function Dashboard() {
    const fleetAnalytics = await getFleetAnalytics()

    return (
        <div>
            <h1>Dashboard</h1>
            <p>{JSON.stringify(fleetAnalytics)}</p>
        </div>
    )
}
