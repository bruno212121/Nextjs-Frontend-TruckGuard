"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Truck as TruckIcon, AlertCircle } from "lucide-react";
import TruckForm, { healthStatuses } from "./_components/TruckForm";
import ComponentsEditor from "./_components/ComponentsEditor";
import SuccessView from "./_components/SuccessView";
import type { NewTruckForm, TruckComponentForm } from "./_components/types";
import { createTruck } from "@/lib/actions/truck.actions";

export default function CreateTruckPage() {
    // estados
    const [isCreated, setIsCreated] = useState(false);
    const [createdTruck, setCreatedTruck] = useState<any>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [createError, setCreateError] = useState<string | null>(null);

    const [newTruck, setNewTruck] = useState<NewTruckForm>({
        plate: "",
        model: "",
        brand: "",
        year: "",
        color: "",
        mileage: "",
        health_status: "Excellent",
        status: "inactive", // Por defecto inactivo ya que no tiene conductor asignado
        fleetanalytics_id: 1,
    });

    const [components, setComponents] = useState<TruckComponentForm[]>([]);

    const [errors, setErrors] = useState<Record<string, string>>({});


    // validación
    const validate = () => {
        const errs: Record<string, string> = {};
        if (!newTruck.plate.trim()) errs.plate = "La placa es requerida";
        if (!newTruck.brand.trim()) errs.brand = "La marca es requerida";
        if (!newTruck.model.trim()) errs.model = "El modelo es requerido";
        if (!newTruck.year.trim()) errs.year = "El año es requerido";
        if (!newTruck.color.trim()) errs.color = "El color es requerido";
        if (!newTruck.mileage.trim()) errs.mileage = "El kilometraje es requerido";
        // Los componentes son opcionales - el backend crea uno por defecto
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    // handlers de componentes
    const addComponent = () =>
        setComponents((prev) => [...prev, { name: "", interval: 10000, status: "Good", last_maintenance_mileage: 0, next_maintenance_mileage: 0 }]);

    const removeComponent = (i: number) =>
        setComponents((prev) => prev.filter((_, idx) => idx !== i));

    const updateComponent = (i: number, field: keyof TruckComponentForm, value: any) =>
        setComponents((prev) => prev.map((c, idx) => (idx === i ? { ...c, [field]: value } : c)));

    // submit
    const handleCreate = async () => {
        if (!validate()) return;

        try {
            setIsCreating(true);
            setCreateError(null);

            // payload final (backend)
            const payload = {
                plate: newTruck.plate,
                model: newTruck.model,
                brand: newTruck.brand,
                year: Number(newTruck.year),
                color: newTruck.color,
                mileage: Number(newTruck.mileage),
                health_status: newTruck.health_status, // El backend espera health_status
                status: newTruck.status, // Estado del camión (activo/inactivo/etc)
                fleetanalytics_id: newTruck.fleetanalytics_id,
                // Los componentes se envían solo si el usuario los agregó
                ...(components.length > 0 && {
                    components: components.map((c) => ({
                        name: c.name,
                        interval: Number(c.interval),
                        status: c.status,
                        last_maintenance_mileage: Number(c.last_maintenance_mileage),
                        next_maintenance_mileage: Number(c.next_maintenance_mileage),
                    }))
                })
            } as any;

            // Llamada real al backend para crear el camión
            const created = await createTruck(payload);

            console.log("[createdTruck] response:", created);

            const newTruckId =
                (created as any)?.truck ??
                (created as any)?.data?.truck_id ??
                (created as any)?.truck_id ??
                (created as any)?.id;

            // TODO: La asignación de conductor se manejará por separado
            // if (payload.driver_id && newTruckId) {
            //     try {
            //         await assignTruck(newTruckId, payload.driver_id);
            //     } catch (assignError) {
            //         console.error("Error al asignar conductor:", assignError);
            //         setAssignmentWarning("El camión se creó exitosamente, pero no se pudo asignar el conductor. Puedes asignarlo manualmente más tarde.");
            //     }
            // }


            // El conductor se asignará por separado, no se muestra en la vista de éxito
            const driverName = null;

            // Formatear respuesta para SuccessView
            const formattedTruck = {
                id: newTruckId,
                created_at: new Date().toISOString(),
                plate: created.plate ?? payload.plate,
                brand: created.brand ?? payload.brand,
                model: created.model ?? payload.model,
                year: created.year ?? payload.year,
                color: created.color ?? payload.color,
                mileage: created.mileage ?? payload.mileage,
                health_status: (created as any).health_status ?? payload.health_status,
                status: (created as any).status ?? payload.status,
                driver_name: driverName,
                components: components.length > 0 ? components : [],
            };

            setCreatedTruck(formattedTruck);
            setIsCreated(true);
        } catch (error) {
            console.error("Error al crear camión:", error);
            setCreateError(error instanceof Error ? error.message : "Error al crear el camión");
        } finally {
            setIsCreating(false);
        }
    };

    const resetAll = () => {
        setIsCreated(false);
        setCreatedTruck(null);
        setNewTruck({
            plate: "",
            model: "",
            brand: "",
            year: "",
            color: "",
            mileage: "",
            health_status: "Excellent",
            status: "inactive",
            fleetanalytics_id: 1,
        });
        setComponents([]);
        setErrors({});
        setCreateError(null);
    };

    if (isCreated && createdTruck) {
        return (
            <main className="flex-1 overflow-auto p-6 bg-gradient-to-r from-slate-900 via-gray-900 to-slate-800 min-h-screen">
                <div className="max-w-5xl mx-auto space-y-6">
                    <SuccessView createdTruck={createdTruck} onCreateAnother={resetAll} />
                </div>
            </main>
        );
    }

    return (
        <main className="flex-1 overflow-auto p-6 bg-gradient-to-r from-slate-900 via-gray-900 to-slate-800 min-h-screen">
            <div className="max-w-5xl mx-auto space-y-8">
                {/* Header / breadcrumb */}
                <div className="space-y-4">
                    <Link href="/trucks">
                        <Button
                            variant="outline"
                            size="sm"
                            className="gap-2 bg-slate-800/50 border-slate-600 text-slate-300 hover:bg-slate-700/50 hover:text-white"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Volver a Camiones
                        </Button>
                    </Link>
                    <div className="text-center lg:text-left">
                        <h2 className="text-3xl font-bold text-white mb-2">Registrar Nuevo Camión</h2>
                        <p className="text-slate-300 text-lg">
                            Completa la información del camión para agregarlo a la flota. Los componentes son opcionales.
                        </p>
                    </div>
                </div>

                {/* Grid principal */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    <div className="xl:col-span-2 space-y-6">
                        <TruckForm
                            value={newTruck}
                            onChange={setNewTruck}
                            errors={errors}
                        />
                    </div>

                    <div className="space-y-6">
                        <ComponentsEditor
                            components={components}
                            onAdd={addComponent}
                            onRemove={removeComponent}
                            onUpdate={updateComponent}
                            errors={errors}
                        />
                    </div>
                </div>

                {/* Error message */}
                {createError && (
                    <div className="bg-red-900/20 border border-red-500 rounded-lg p-4">
                        <div className="flex items-center gap-2 text-red-400">
                            <AlertCircle className="h-4 w-4" />
                            <span className="font-medium">Error al crear el camión</span>
                        </div>
                        <p className="text-red-300 text-sm mt-1">{createError}</p>
                    </div>
                )}


                {/* Footer acciones */}
                <div className="flex gap-4 justify-center pt-6 border-t border-slate-700">
                    <Link href="/trucks">
                        <Button
                            variant="outline"
                            size="lg"
                            className="bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600 px-8"
                            disabled={isCreating}
                        >
                            Cancelar
                        </Button>
                    </Link>
                    <Button
                        onClick={handleCreate}
                        size="lg"
                        className="bg-blue-600 hover:bg-blue-700 px-8 shadow-lg"
                        disabled={isCreating}
                    >
                        {isCreating ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Creando...
                            </>
                        ) : (
                            <>
                                <TruckIcon className="h-4 w-4 mr-2" />
                                Crear Camión
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </main>
    );
}
