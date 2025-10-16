// src/components/EventList.tsx
import React from 'react'
import type { EventItem } from '../types'
import { parseISO, isValid, format } from 'date-fns'

function fmtDate(iso?: string) {
  if (!iso) return 'Date TBA'
  try {
    const d = parseISO(iso)
    if (!isValid(d)) return 'Invalid date'
    return format(d, 'PPpp')
  } catch { return 'Invalid date' }
}

export default function EventList({ events, onSelect }: { events: EventItem[], onSelect: (e: EventItem) => void }) {
  if (!events || events.length === 0) return <div className="card">No events found for this venue.</div>

  return (
    <div className="grid">
      {events.map(evt => (
        <article key={evt.id} className="card event" onClick={() => onSelect(evt)} tabIndex={0}
                 onKeyDown={(e) => { if (e.key === 'Enter') onSelect(evt) }}>
          <h3>{evt.name ?? 'Untitled event'}</h3>
          <div className="meta">
            <time>{fmtDate(evt.date ?? evt.startDate)}</time>
            <span>{evt.location ?? evt.venue_name ?? 'Location TBA'}</span>
          </div>
          <div style={{ fontSize: '0.9rem', color: '#555', marginBottom: 8 }}>
            <strong>{evt.venue_name ?? 'Venue unknown'}</strong>
          </div>
        </article>
      ))}
    </div>
  )
}
