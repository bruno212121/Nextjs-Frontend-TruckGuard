"use client"

import {
    GoogleMap,
    DirectionsService,
    DirectionsRenderer,
} from "@react-google-maps/api"
import { useEffect, useRef, useState } from "react"

type Props = {
    origin: string
    destination: string
    height?: number | string
    zoom?: number
    isLoaded: boolean
    onRouteComputed?: (info: { distanceMeters: number; distanceText?: string; durationText?: string }) => void
}

export default function GoogleMaps({
    origin,
    destination,
    height = 300,
    zoom = 12,
    isLoaded,
    onRouteComputed,
}: Props) {
    const mapRef = useRef<google.maps.Map | null>(null)
    const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null)

    const fallbackCenter = { lat: -34.603722, lng: -58.381592 }

    // reset cuando cambian origen/destino
    useEffect(() => setDirections(null), [origin, destination])

    if (!isLoaded) return <div>Cargando mapa...</div>

    return (
        <GoogleMap
            mapContainerStyle={{ width: "100%", height }}
            center={fallbackCenter}
            zoom={zoom}
            onLoad={(m) => {
                mapRef.current = m
            }}
            onUnmount={() => {
                mapRef.current = null
            }}
        >
            {/* cuando hay ambos, pedimos la ruta */}
            {!directions && origin && destination && (
                <DirectionsService
                    options={{
                        origin,
                        destination,
                        travelMode: google.maps.TravelMode.DRIVING,
                    }}
                    callback={(res, status) => {
                        if (status === google.maps.DirectionsStatus.OK && res) {
                            setDirections(res)
                            // fitBounds al resultado
                            const route = res.routes?.[0]
                            const leg = route?.legs?.[0]
                            const bounds =
                                route?.bounds ??
                                (() => {
                                    const b = new google.maps.LatLngBounds()
                                    route?.overview_path?.forEach((p) => b.extend(p))
                                    return b
                                })()
                            if (bounds && mapRef.current) mapRef.current.fitBounds(bounds)

                            if (onRouteComputed && leg) {
                                onRouteComputed({
                                    distanceMeters: leg.distance?.value ?? 0,
                                    distanceText: leg.distance?.text,
                                    durationText: leg.duration?.text,
                                })
                            }
                        }
                    }}
                />
            )}

            {directions && <DirectionsRenderer options={{ directions }} />}
        </GoogleMap>
    )
}
