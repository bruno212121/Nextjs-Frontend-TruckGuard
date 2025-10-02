import { getDriversWithoutTruck } from "@/lib/actions/drivers.actions";
import { getTrucks } from "@/lib/actions/truck.actions";
import DriversPageClient from "./_components/DriversPageClient";

export default async function DriversPage() {
  const [{ drivers }, { trucks }] = await Promise.all([
    getDriversWithoutTruck(),
    getTrucks(1, 200),
  ]);

  // Filtrar camiones sin conductor (o inactivos)
  const trucksWithoutDriver = (trucks ?? []).filter((t) => !t.driver || t.status?.toLowerCase() === "inactivo");

  return (
    <DriversPageClient
      initialDrivers={drivers ?? []}
      initialTrucks={trucksWithoutDriver}
    />
  );
}