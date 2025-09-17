"use client";

import { useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Activity, Calendar, Gauge, Hash, Palette, Settings, Truck as TruckIcon } from "lucide-react";
import type { NewTruckForm, HealthStatusValue } from "./types";

const truckBrands = ["Volvo", "Scania", "Mercedes-Benz", "MAN", "DAF", "Iveco", "Renault", "Freightliner"];

export const healthStatuses: Array<{ value: HealthStatusValue; label: string; dot: string }> = [
    { value: "Excellent", label: "Excelente", dot: "bg-green-500" },
    { value: "Very Good", label: "Muy Bueno", dot: "bg-green-500" },
    { value: "Good", label: "Bueno", dot: "bg-blue-500" },
    { value: "Fair", label: "Regular", dot: "bg-yellow-500" },
    { value: "Maintenance Required", label: "Mantenimiento Requerido", dot: "bg-red-500" },
];


type Props = {
    value: NewTruckForm;
    onChange: (next: NewTruckForm) => void;
    errors: Record<string, string>;
};

export default function TruckForm({ value, onChange, errors }: Props) {
    const currentYear = useMemo(() => new Date().getFullYear(), []);

    return (
        <Card className="bg-slate-800/50 border-slate-700 shadow-xl">
            <CardHeader className="pb-4">
                <CardTitle className="text-white flex items-center gap-2 text-xl">
                    <TruckIcon className="h-5 w-5 text-blue-400" />
                    Información del Camión
                </CardTitle>
                <p className="text-slate-400 text-sm">Datos básicos del vehículo</p>
            </CardHeader>

            <CardContent className="space-y-6">
                {/* Placa / Marca */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <Label htmlFor="plate" className="text-slate-300 flex items-center gap-2">
                            <Hash className="h-4 w-4" /> Placa *
                        </Label>
                        <Input
                            id="plate"
                            value={value.plate}
                            onChange={(e) => onChange({ ...value, plate: e.target.value.toUpperCase() })}
                            placeholder="ABC123"
                            className={`bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 ${errors.plate ? "border-red-500" : ""}`}
                        />
                        {errors.plate && <FieldError msg={errors.plate} />}
                    </div>

                    <div>
                        <Label htmlFor="brand" className="text-slate-300 flex items-center gap-2">
                            <TruckIcon className="h-4 w-4" /> Marca *
                        </Label>
                        <Select
                            value={value.brand}
                            onValueChange={(brand) => onChange({ ...value, brand })}
                        >
                            <SelectTrigger className={`bg-slate-700 border-slate-600 text-white ${errors.brand ? "border-red-500" : ""}`}>
                                <SelectValue placeholder="Seleccionar marca" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-700 border-slate-600">
                                {truckBrands.map((b) => (
                                    <SelectItem key={b} value={b} className="text-white hover:bg-slate-600">
                                        {b}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.brand && <FieldError msg={errors.brand} />}
                    </div>
                </div>

                {/* Modelo / Año */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FieldText
                        id="model"
                        labelIcon={<Settings className="h-4 w-4" />}
                        label="Modelo *"
                        value={value.model}
                        onChange={(model) => onChange({ ...value, model })}
                        placeholder="FH16"
                        error={errors.model}
                    />
                    <FieldNumber
                        id="year"
                        labelIcon={<Calendar className="h-4 w-4" />}
                        label="Año *"
                        min={1990}
                        max={currentYear + 1}
                        value={value.year}
                        onChange={(year) => onChange({ ...value, year })}
                        placeholder="2020"
                        error={errors.year}
                    />
                </div>

                {/* Color / Kilometraje */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FieldText
                        id="color"
                        labelIcon={<Palette className="h-4 w-4" />}
                        label="Color *"
                        value={value.color}
                        onChange={(color) => onChange({ ...value, color })}
                        placeholder="Blanco"
                        error={errors.color}
                    />
                    <FieldNumber
                        id="mileage"
                        labelIcon={<Gauge className="h-4 w-4" />}
                        label="Kilometraje *"
                        min={0}
                        value={value.mileage}
                        onChange={(mileage) => onChange({ ...value, mileage })}
                        placeholder="50000"
                        error={errors.mileage}
                    />
                </div>

                {/* Estado de salud */}
                <div className="grid grid-cols-1 gap-6">
                    <div>
                        <Label htmlFor="health_status" className="text-slate-300 flex items-center gap-2">
                            <Activity className="h-4 w-4" /> Estado de Salud
                        </Label>
                        <Select
                            value={value.health_status}
                            onValueChange={(health_status) => onChange({ ...value, health_status: health_status as HealthStatusValue })}
                        >
                            <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-700 border-slate-600">
                                {healthStatuses.map((s) => (
                                    <SelectItem key={s.value} value={s.value} className="text-white hover:bg-slate-600">
                                        {s.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

function FieldError({ msg }: { msg: string }) {
    return (
        <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" /> {msg}
        </p>
    );
}

function FieldText({
    id, label, labelIcon, value, onChange, placeholder, error,
}: {
    id: string; label: string; labelIcon: React.ReactNode; value: string; onChange: (v: string) => void; placeholder?: string; error?: string;
}) {
    return (
        <div>
            <Label htmlFor={id} className="text-slate-300 flex items-center gap-2">
                {labelIcon} {label}
            </Label>
            <Input
                id={id}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className={`bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 ${error ? "border-red-500" : ""}`}
            />
            {error && <FieldError msg={error} />}
        </div>
    );
}

function FieldNumber({
    id, label, labelIcon, value, onChange, placeholder, error, min, max,
}: {
    id: string; label: string; labelIcon: React.ReactNode; value: string; onChange: (v: string) => void; placeholder?: string; error?: string; min?: number; max?: number;
}) {
    return (
        <div>
            <Label htmlFor={id} className="text-slate-300 flex items-center gap-2">
                {labelIcon} {label}
            </Label>
            <Input
                id={id}
                type="number"
                min={min}
                max={max}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className={`bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 ${error ? "border-red-500" : ""}`}
            />
            {error && <FieldError msg={error} />}
        </div>
    );
}
