"use client";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

type Props = {
  value: "Activo" | "Mantenimiento" | "Inactivo";
  onChange: (v: "Activo" | "Mantenimiento" | "Inactivo") => void;
  className?: string;
};

export default function StatusSelect({ value, onChange, className }: Props) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as any)}>
      <SelectTrigger className={className ?? "w-auto h-8 bg-slate-700 border-slate-600 text-slate-300 text-xs"}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="bg-slate-700 border-slate-600">
        <SelectItem value="Activo" className="text-white hover:bg-slate-600">Activo</SelectItem>
        <SelectItem value="Mantenimiento" className="text-white hover:bg-slate-600">Mantenimiento</SelectItem>
        <SelectItem value="Inactivo" className="text-white hover:bg-slate-600">Inactivo</SelectItem>
      </SelectContent>
    </Select>
  );
}
