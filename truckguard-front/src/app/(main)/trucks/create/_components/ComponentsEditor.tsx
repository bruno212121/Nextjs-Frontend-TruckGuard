"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, X, Settings } from "lucide-react";
import { healthStatuses } from "./TruckForm";
import type { TruckComponentForm, HealthStatusValue } from "./types";

type Props = {
    components: TruckComponentForm[];
    onAdd: () => void;
    onRemove: (index: number) => void;
    onUpdate: (index: number, field: keyof TruckComponentForm, value: any) => void;
    errors: Record<string, string>;
};

export default function ComponentsEditor({ components, onAdd, onRemove, onUpdate, errors }: Props) {
    return (
        <Card className="bg-slate-800/50 border-slate-700 shadow-xl">
            <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-white flex items-center gap-2 text-xl">
                            <Settings className="h-5 w-5 text-blue-400" />
                            Componentes (Opcional)
                        </CardTitle>
                        <p className="text-slate-400 text-sm mt-1">Sistemas del camión - El backend creará uno por defecto</p>
                    </div>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={onAdd}
                        className="bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Agregar
                    </Button>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                {components.length === 0 && (
                    <div className="text-center py-8 text-slate-400">
                        <Settings className="h-12 w-12 mx-auto mb-3 opacity-50" />
                        <p className="text-sm">No hay componentes agregados</p>
                        <p className="text-xs mt-1">El backend creará un componente por defecto</p>
                    </div>
                )}
                {components.map((comp, idx) => (
                    <div key={idx} className="p-4 border border-slate-600 rounded-lg bg-slate-700/50 space-y-4">
                        <div className="flex items-center justify-between">
                            <h4 className="font-medium text-white">Componente {idx + 1}</h4>
                            {components.length > 0 && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onRemove(idx)}
                                    className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            )}
                        </div>

                        <div className="space-y-3">
                            <div>
                                <Label className="text-slate-300">Nombre *</Label>
                                <Input
                                    value={comp.name}
                                    onChange={(e) => onUpdate(idx, "name", e.target.value)}
                                    placeholder="Filtros"
                                    className={`bg-slate-600 border-slate-500 text-white placeholder:text-slate-400 ${errors[`component_${idx}_name`] ? "border-red-500" : ""}`}
                                />
                                {errors[`component_${idx}_name`] && (
                                    <p className="text-red-400 text-xs mt-1">{errors[`component_${idx}_name`]}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <FieldNumber
                                    label="Intervalo (km)"
                                    value={comp.interval}
                                    onChange={(v) => onUpdate(idx, "interval", Number(v))}
                                    placeholder="10000"
                                />
                                <Select
                                    value={comp.status}
                                    onValueChange={(v) => onUpdate(idx, "status", v as HealthStatusValue)}
                                >
                                    <SelectTrigger className="bg-slate-600 border-slate-500 text-white">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-slate-600 border-slate-500">
                                        {healthStatuses.map((s) => (
                                            <SelectItem key={s.value} value={s.value} className="text-white hover:bg-slate-500">
                                                {s.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <FieldNumber
                                    label="Último Mant. (km)"
                                    value={comp.last_maintenance_mileage}
                                    onChange={(v) => onUpdate(idx, "last_maintenance_mileage", Number(v))}
                                    placeholder="40000"
                                />
                                <FieldNumber
                                    label="Próximo Mant. (km)"
                                    value={comp.next_maintenance_mileage}
                                    onChange={(v) => onUpdate(idx, "next_maintenance_mileage", Number(v))}
                                    placeholder="50000"
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}

function FieldNumber({
    label, value, onChange, placeholder,
}: { label: string; value: number; onChange: (v: string) => void; placeholder?: string }) {
    return (
        <div>
            <Label className="text-slate-300">{label}</Label>
            <Input
                type="number"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="bg-slate-600 border-slate-500 text-white placeholder:text-slate-400"
            />
        </div>
    );
}
