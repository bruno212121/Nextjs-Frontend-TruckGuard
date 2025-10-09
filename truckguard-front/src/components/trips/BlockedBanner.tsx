"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TriangleAlert, OctagonX, Info } from "lucide-react";
import Link from "next/link";

export default function BlockedBanner({
    title,
    subtitle,
    description,
    components = [],
    severity = "warning",
    ctaHref = "/maintenance/pending",
}: {
    title: string;
    subtitle?: string;
    description: string;
    components?: string[];
    severity?: "critical" | "warning" | "error";
    ctaHref?: string;
}) {
    const tone =
        severity === "critical"
            ? "border-red-500/40 bg-red-500/10"
            : severity === "warning"
                ? "border-yellow-500/40 bg-yellow-500/10"
                : "border-rose-500/40 bg-rose-500/10";

    const iconColor =
        severity === "critical"
            ? "text-red-400"
            : severity === "warning"
                ? "text-yellow-400"
                : "text-rose-400";

    const Icon = severity === "critical" ? OctagonX : severity === "warning" ? TriangleAlert : Info;

    return (
        <Card className={`mb-4 ${tone}`}>
            <CardHeader className="flex flex-row items-center gap-2 pb-2">
                <Icon className={`h-5 w-5 shrink-0 ${iconColor}`} />
                <div className="space-y-0.5">
                    <CardTitle className="text-sm text-white">{title}</CardTitle>
                    {subtitle ? (
                        <p className="text-xs text-slate-300 leading-tight">{subtitle}</p>
                    ) : null}
                </div>
            </CardHeader>
            <CardContent className="pt-0">
                <p className="text-sm text-slate-200">{description}</p>

                {components.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                        {components.map((c) => (
                            <Badge
                                key={c}
                                variant="outline"
                                className={`text-xs px-2 py-1 ${severity === "critical"
                                        ? "border-red-400/50 text-red-200 bg-red-800/20"
                                        : severity === "warning"
                                            ? "border-yellow-400/50 text-yellow-200 bg-yellow-800/20"
                                            : "border-rose-400/50 text-rose-200 bg-rose-800/20"
                                    }`}
                            >
                                {c}
                            </Badge>
                        ))}
                    </div>
                )}

                <div className="mt-3">
                    <Link
                        href={ctaHref}
                        className="text-xs underline text-blue-400 hover:text-blue-300 transition-colors"
                    >
                        Ver mantenimientos pendientes →
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
}
