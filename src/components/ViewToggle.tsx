// src/components/ViewToggle.tsx
import React from 'react'

export default function ViewToggle({
  view,
  onChange
}: {
  view: 'list' | 'calendar'
  onChange: (v: 'list' | 'calendar') => void
}) {
  return (
    <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <label htmlFor="view-mode" style={{ marginRight: 6 }}>
        View mode:
      </label>
      <select
        id="view-mode"
        value={view}
        onChange={(e) => onChange(e.target.value as 'list' | 'calendar')}
        aria-label="View mode"
      >
        <option value="list">List View</option>
        <option value="calendar">Calendar View</option>
      </select>
    </div>
  )
}
