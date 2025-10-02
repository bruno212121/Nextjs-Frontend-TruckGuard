
import { getTrucks } from "@/lib/actions/truck.actions";
import MaintenancePageClient from "./_components/MaintenancePageClient";

export default async function MaintenancePage() {
    // Obtener todos los camiones para mostrar información básica
    const { trucks } = await getTrucks(1, 100);

    return <MaintenancePageClient initialTrucks={trucks ?? []} />;
}
