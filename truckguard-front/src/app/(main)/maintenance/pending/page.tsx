import { getPendingMaintenances } from "@/lib/actions/fleetanalytics.actions";
import PendingMaintenancesClient from "./_components/PendingMaintenancesClient";

export default async function PendingMaintenancesPage() {
    const pendingData = await getPendingMaintenances();

    return <PendingMaintenancesClient initialData={pendingData} />;
}
