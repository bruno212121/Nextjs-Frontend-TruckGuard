"use client";

import { useState } from "react";
import {
    Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";

type DriverLite = { id: number; name: string; surname: string };

type Props = {
    trigger: React.ReactNode;               // botón que abre el diálogo
    plate: string;                          // para el texto del título
    drivers: DriverLite[];                  // opciones
    initialDriverId?: number | null;        // para 'editar'
    onConfirm: (driverId: number) => void;  // callback al confirmar
};

export default function AssignDriverDialog({
    trigger, plate, drivers, initialDriverId, onConfirm,
}: Props) {
    const [selectedId, setSelectedId] = useState<string>(initialDriverId ? String(initialDriverId) : "");

    return (
        <Dialog>
            <DialogTrigger asChild>
                {trigger}
            </DialogTrigger>
            <DialogContent className="bg-slate-800 border-slate-700">
                <DialogHeader>
                    <DialogTitle className="text-white">
                        {initialDriverId ? "Cambiar Conductor" : "Asignar Conductor"}
                    </DialogTitle>
                    <DialogDescription className="text-slate-300">
                        Selecciona un conductor para {plate}
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <Select value={selectedId} onValueChange={(value) => setSelectedId(value)}>
                        <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-700 border-slate-600">
                            {drivers.map((driver) => (
                                <SelectItem
                                    key={driver.id}
                                    value={driver.id.toString()}
                                    className="text-white hover:bg-slate-600"
                                >
                                    {driver.name} {driver.surname}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <div className="flex gap-2">
                        <Button
                            onClick={() => onConfirm(Number(selectedId))}
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            Asignar
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>

    );
}

