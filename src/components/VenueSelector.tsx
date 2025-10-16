// src/components/VenueSelector.tsx
import React from 'react'
import type { Venue } from '../types'

export default function VenueSelector({
  venues,
  value,
  onChange
}: {
  venues: Venue[]
  value: string | null
  onChange: (id: string | null) => void
}) {
  if (!venues || venues.length === 0) return <div className="card">No venues available.</div>

  return (
    <div className="card">
      <label htmlFor="venue">Choose venue:</label>
      <select
        id="venue"
        value={value ?? ''}
        onChange={(e) => {
          const v = e.target.value
          onChange(v === '' ? null : String(v))
        }}
      >
        <option value="">All Venues</option>
        {venues.map((v) => (
          <option key={v.id} value={String(v.id)}>
            {v.name ?? v.id}
          </option>
        ))}
      </select>
    </div>
  )
}
