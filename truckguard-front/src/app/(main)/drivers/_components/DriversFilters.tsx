"use client";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function DriversFilters({
    search,
    onSearch,
}: {
    search: string;
    onSearch: (v: string) => void;
}) {
    return (
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input
                    placeholder="Buscar por nombre o email..."
                    value={search}
                    onChange={(e) => onSearch(e.target.value)}
                    className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-400"
                />
            </div>
        </div>
    );
}
