"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, X } from "lucide-react";
import type { Truck, ComponentStatus } from "@/types/trucks.types";
import { createMaintenance } from "@/lib/actions/truck.actions";

interface CreateMaintenanceModalProps {
    isOpen: boolean;
    onClose: () => void;
    truck: Truck;
    component: ComponentStatus;
    onSuccess?: () => void;
}

export default function CreateMaintenanceModal({
    isOpen,
    onClose,
    truck,
    component,
    onSuccess
}: CreateMaintenanceModalProps) {
    const [formData, setFormData] = useState({
        description: `Mantenimiento de ${component.component_name}`,
        component: component.component_name,
        cost: "",
        mileage_interval: component.maintenance_interval?.toString() || "5000",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Validaciones
        if (!formData.cost || parseFloat(formData.cost) <= 0) {
            setError("El costo debe ser mayor a 0");
            return;
        }

        if (!formData.mileage_interval || parseInt(formData.mileage_interval) <= 0) {
            setError("El intervalo de kilometraje debe ser mayor a 0");
            return;
        }

        setIsSubmitting(true);

        try {
            const payload = {
                description: formData.description,
                component: formData.component,
                truck_id: truck.truck_id,
                driver_id: truck.driver?.id || null,
                cost: parseFloat(formData.cost),
                mileage_interval: parseInt(formData.mileage_interval),
                maintenance_interval: parseInt(formData.mileage_interval),
            };

            await createMaintenance(payload);

            // Cerrar modal y llamar callback de éxito
            onClose();
            alert("Mantenimiento creado exitosamente");

            // Si hay callback de éxito, ejecutarlo
            if (onSuccess) {
                onSuccess();
            }

        } catch (error) {
            console.error("Error:", error);
            setError(`Error: ${error instanceof Error ? error.message : 'Error desconocido'}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] bg-slate-800 border-slate-700">
                <DialogHeader>
                    <div className="flex items-center justify-between">
                        <DialogTitle className="text-xl text-white">
                            Crear Orden de Mantenimiento
                        </DialogTitle>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onClose}
                            className="text-slate-400 hover:text-white"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                    <p className="text-slate-300 text-sm">
                        {truck.plate} - {component.component_name}
                    </p>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Descripción */}
                        <div className="md:col-span-2">
                            <Label htmlFor="description" className="text-slate-300">
                                Descripción
                            </Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => handleInputChange("description", e.target.value)}
                                className="mt-1 bg-slate-700 border-slate-600 text-white"
                                rows={2}
                            />
                        </div>


                        {/* Componente */}
                        <div>
                            <Label htmlFor="component" className="text-slate-300">
                                Componente
                            </Label>
                            <Input
                                id="component"
                                value={formData.component}
                                onChange={(e) => handleInputChange("component", e.target.value)}
                                className="mt-1 bg-slate-700 border-slate-600 text-white"
                            />
                        </div>

                        {/* Costo */}
                        <div>
                            <Label htmlFor="cost" className="text-slate-300">
                                Costo ($)
                            </Label>
                            <Input
                                id="cost"
                                type="number"
                                step="0.01"
                                value={formData.cost}
                                onChange={(e) => handleInputChange("cost", e.target.value)}
                                className="mt-1 bg-slate-700 border-slate-600 text-white"
                                placeholder="150.5"
                            />
                        </div>

                        {/* Intervalo de Kilometraje */}
                        <div>
                            <Label htmlFor="mileage_interval" className="text-slate-300">
                                Intervalo de Kilometraje
                            </Label>
                            <Input
                                id="mileage_interval"
                                type="number"
                                value={formData.mileage_interval}
                                onChange={(e) => handleInputChange("mileage_interval", e.target.value)}
                                className="mt-1 bg-slate-700 border-slate-600 text-white"
                            />
                        </div>

                    </div>

                    {/* Mensaje de error */}
                    {error && (
                        <div className="bg-red-900/30 border border-red-600 rounded-lg p-3">
                            <p className="text-red-400 text-sm">{error}</p>
                        </div>
                    )}

                    {/* Botones */}
                    <div className="flex gap-3 pt-4">
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
                        >
                            <Calendar className="h-4 w-4 mr-2" />
                            {isSubmitting ? "Creando..." : "Crear Orden de Mantenimiento"}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
                        >
                            Cancelar
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
