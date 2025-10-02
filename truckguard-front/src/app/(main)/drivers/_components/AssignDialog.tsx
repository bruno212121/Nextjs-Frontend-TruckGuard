"use client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Truck } from "@/types/trucks.types";

export default function AssignDialog({
  open,
  onOpenChange,
  driver,
  trucks,
  selectedTruckId,
  onChangeTruckId,
  onConfirm,
  loading,
  error,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  driver: { id: number; name: string; surname: string } | null;
  trucks: Truck[];
  selectedTruckId: string;
  onChangeTruckId: (v: string) => void;
  onConfirm: () => void;
  loading?: boolean;
  error?: string | null;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-800 border-slate-700 text-white">
        <DialogHeader>
          <DialogTitle>
            {driver ? `Asignar Camión a ${driver.name} ${driver.surname}` : "Asignar Camión"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-300 mb-2 block">
              Seleccionar Camión Disponible
            </label>
            <Select value={selectedTruckId} onValueChange={onChangeTruckId}>
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                <SelectValue placeholder="Selecciona un camión..." />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                {trucks.map((t) => (
                  <SelectItem key={t.truck_id} value={t.truck_id?.toString() || ""} className="text-white">
                    {t.plate} - {t.brand} {t.model} ({t.year})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <div className="flex gap-3">
            <Button onClick={onConfirm} disabled={!selectedTruckId || loading} className="flex-1 bg-blue-600 hover:bg-blue-700">
              {loading ? "Asignando..." : "Confirmar Asignación"}
            </Button>
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700"
              disabled={loading}
            >
              Cancelar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
