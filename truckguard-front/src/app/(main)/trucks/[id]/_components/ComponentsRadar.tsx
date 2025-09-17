"use client";

import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    ResponsiveContainer,
    PolarRadiusAxis,
    Tooltip,
} from "recharts";

type D = { label: string; value: number };

// Función para obtener el color según el porcentaje
const getHealthColor = (value: number) => {
    if (value >= 80) return "text-emerald-400";
    if (value >= 60) return "text-yellow-400";
    if (value >= 40) return "text-orange-400";
    return "text-red-400";
};

// Función para obtener el color de fondo según el porcentaje
const getHealthBgColor = (value: number) => {
    if (value >= 80) return "bg-emerald-500/20 border-emerald-500/30";
    if (value >= 60) return "bg-yellow-500/20 border-yellow-500/30";
    if (value >= 40) return "bg-orange-500/20 border-orange-500/30";
    return "bg-red-500/20 border-red-500/30";
};

export default function ComponentsRadar({ data }: { data: D[] }) {
    return (
        <div className="space-y-6">
            {/* Gráfico Radar */}
            <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
                        <PolarGrid stroke="#334155" />
                        <PolarAngleAxis dataKey="label" tick={{ fill: "#94a3b8", fontSize: 12 }} />
                        <PolarRadiusAxis tick={false} axisLine={false} />
                        <Tooltip
                            contentStyle={{
                                background: "rgba(15,23,42,.9)",
                                border: "1px solid #334155",
                                color: "#e2e8f0",
                            }}
                        />
                        <Radar
                            name="Estado"
                            dataKey="value"
                            stroke="#60a5fa"
                            fill="#60a5fa"
                            fillOpacity={0.35}
                        />
                    </RadarChart>
                </ResponsiveContainer>
            </div>

            {/* Tarjetas de Componentes */}
            <div className="grid grid-cols-2 gap-3">
                {data.map((component, index) => (
                    <div
                        key={index}
                        className={`rounded-lg border p-3 ${getHealthBgColor(component.value)}`}
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-slate-300 text-sm font-medium">
                                {component.label}
                            </span>
                            <span className={`text-lg font-bold ${getHealthColor(component.value)}`}>
                                {component.value}%
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
