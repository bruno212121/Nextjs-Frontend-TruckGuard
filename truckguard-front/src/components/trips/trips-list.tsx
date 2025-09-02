"use client"

import { Trip } from "@/types/trips.types"
import TripCard from "./trip-card"

interface TripsListProps {
  trips: Trip[]
  onStatusChange: (tripId: number, newStatus: string) => void
  onDelete: (tripId: number) => void
  onViewDetails: (trip: Trip) => void
}

export default function TripsList({ trips, onStatusChange, onDelete, onViewDetails }: TripsListProps) {
  return (
    <div className="grid gap-4">
      {trips.map((trip) => (
        <TripCard
          key={trip.trip_id}
          trip={trip}
          onStatusChange={onStatusChange}
          onDelete={onDelete}
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  )
}