import { getTrucks } from "@/lib/actions/truck.actions";
import { getDriversWithoutTruck } from "@/lib/actions/drivers.actions";
import TrucksClient from "./_client/TrucksClient";

export default async function TrucksPage() {
    // Fetch seguro (con cookies) en el servidor
    const [{ trucks }, { drivers }] = await Promise.all([
        getTrucks(1, 50),               // lista de camiones (con driver si ya está asignado)
        getDriversWithoutTruck(),       // conductores disponibles (sin camión)
    ]);

    return (
        <TrucksClient
            initialTrucks={trucks}
            initialAvailableDrivers={drivers}
        />
    );
}