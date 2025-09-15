"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Filter, Search } from "lucide-react";


type Props = {
    search: string;
    onSearch(s: string): void;
    status: "all" | "Activo" | "Mantenimiento" | "Inactivo";
    onStatusChange(s: Props["status"]): void;
    onCreate(): void;
  };

  export default function FiltersBar({ search, onSearch, status, onStatusChange, onCreate }: Props) {
    return (
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Buscar por placa, marca o modelo…"
            className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-400"
          />
        </div>
  
        <Select value={status} onValueChange={(v) => onStatusChange(v as Props["status"])}>
          <SelectTrigger className="w-full sm:w-48 bg-slate-800/50 border-slate-700 text-white">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700">
            <SelectItem value="all" className="text-white">Todos</SelectItem>
            <SelectItem value="Activo" className="text-white">Activo</SelectItem>
            <SelectItem value="Mantenimiento" className="text-white">Mantenimiento</SelectItem>
            <SelectItem value="Inactivo" className="text-white">Inactivo</SelectItem>
          </SelectContent>
        </Select>
  
        <Button onClick={onCreate} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Crear camión
        </Button>
      </div>
    );
  }