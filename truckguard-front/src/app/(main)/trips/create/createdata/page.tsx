"use client"

import { useEffect, useState } from "react"
import { TripConfirmation } from "../_components/createdata"

export default function CreatedDataPage() {
    const [tripData, setTripData] = useState<any | null>(null)

    useEffect(() => {
        try {
            const raw = localStorage.getItem("created_trip")
            if (raw) setTripData(JSON.parse(raw))
        } catch { }
    }, [])

    if (!tripData) return <div className="p-6 text-slate-300">No hay datos de viaje disponibles.</div>

    return (
        <div className="p-6">
            <TripConfirmation
                tripData={tripData}
                onCreateAnother={() => {
                    try { localStorage.removeItem("created_trip") } catch { }
                    window.location.href = "/trips/create"
                }}
            />
        </div>
    )
}


