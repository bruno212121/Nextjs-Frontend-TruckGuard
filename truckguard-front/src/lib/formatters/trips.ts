export function formatTripBlockError(err: {
    code?: string;
    severity?: "critical" | "warning" | "error";
    reason?: "components_requiring_maintenance" | "components_fair_condition" | string;
    components?: string[];
    message?: string;
}) {
    const components = err.components ?? [];
    const list = components.join(", ");

    if (err.code === "TRIP_BLOCKED_COMPONENTS") {
        if (err.reason === "components_requiring_maintenance") {
            return {
                title: "No se puede crear el viaje",
                subtitle: "Mantenimiento requerido",
                description: `Los siguientes componentes requieren mantenimiento: ${list}.`,
                severity: "critical" as const,
            };
        }
        if (err.reason === "components_fair_condition") {
            return {
                title: "No se puede crear el viaje",
                subtitle: "Estado regular",
                description: `Los siguientes componentes necesitan atención (estado regular): ${list}.`,
                severity: "warning" as const,
            };
        }
    }

    return {
        title: "No se puede crear el viaje",
        subtitle: "Error",
        description: err.message ?? "Ocurrió un error al crear el viaje.",
        severity: (err.severity ?? "error") as "critical" | "warning" | "error",
    };
}
