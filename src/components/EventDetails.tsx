// src/components/EventDetails.tsx
import React from 'react'
import type { EventItem } from '../types'
import { parseISO, isValid, format } from 'date-fns'

function formatDateIso(iso?: string) {
  if (!iso) return 'Date TBA'
  try {
    const d = parseISO(iso)
    if (!isValid(d)) return 'Invalid date'
    return format(d, 'PPpp')
  } catch {
    return 'Invalid date'
  }
}

export default function EventDetails({ event, onClose }: { event: EventItem | null, onClose: () => void }) {
  if (!event) return null

  const dateToShow = event.date ?? event.startDate ?? undefined
  const locationToShow = event.location ?? event.venue_name ?? 'Location TBA'

  return (
    <div className="modal" role="dialog" aria-modal="true">
      <div className="modal-body card">
        <button className="close" onClick={onClose} aria-label="Close">✕</button>
        <h2>{event.name ?? 'Untitled event'}</h2>
        <p><strong>Date:</strong> {formatDateIso(dateToShow)}</p>
        <p><strong>Location:</strong> {locationToShow}</p>
        <p><strong>Venue:</strong> {event.venue_name ?? 'Venue unknown'}</p>
        <p><strong>Description:</strong></p>
        <p>{event.description ?? 'No description available.'}</p>
      </div>
    </div>
  )
}
