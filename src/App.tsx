// src/App.tsx
import React, { useEffect, useState } from 'react'
import { getEventData } from './api'
import type { Venue, EventItem } from './types'
import VenueSelector from './components/VenueSelector'
import EventList from './components/EventList'
import EventDetails from './components/EventDetails'
import ViewToggle from './components/ViewToggle'
import CalendarView from './components/CalendarView'

export default function App() {
  const [venues, setVenues] = useState<Venue[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedVenueId, setSelectedVenueId] = useState<string | null>(null)
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null)
  const [dataSource, setDataSource] = useState<'remote'|'fallback'|null>(null)
  const [viewMode, setViewMode] = useState<'list'|'calendar'>('list')

  useEffect(() => {
    let mounted = true
    setLoading(true)
    getEventData()
      .then(res => {
        if (!mounted) return
        setVenues(res.data.venues)
        setDataSource(res.source)
      })
      .catch(err => {
        console.error(err)
        setError('Failed to load events data.')
      })
      .finally(() => mounted && setLoading(false))
    return () => { mounted = false }
  }, [])

  // Debug helper: ensure all venue ids are strings
  // console.log('venues', venues.map(v => ({ id: v.id, name: v.name, events: (v.events||[]).length })))

  // compute displayed events correctly by comparing strings
  const currentVenue = selectedVenueId ? venues.find(v => String(v.id) === String(selectedVenueId)) ?? null : null
const displayedEvents: EventItem[] = currentVenue ? (currentVenue.events ?? []) : venues.flatMap(v => v.events ?? [])


  return (
    <div className="container">
      <header className="header">
        <h1>TEG Events</h1>
        <p className="muted">Source: {dataSource ?? 'loading...'}</p>
      </header>

      <main>
        {loading && <div className="center">Loading events…</div>}
        {error && <div className="error">Error: {error}</div>}

        {!loading && !error && (
          <>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
              <VenueSelector venues={venues} value={selectedVenueId} onChange={(id) => {
                console.log('Venue selected:', id)
                setSelectedVenueId(id)
              }} />
              <ViewToggle view={viewMode} onChange={(m) => setViewMode(m)} />
            </div>

            {viewMode === 'list' ? (
              <EventList events={displayedEvents} onSelect={(e) =>{ // where you call setSelectedEvent(e)
                console.log('opening details for event:', e)
                setSelectedEvent(e)
              }} />
            ) : (
              <CalendarView events={displayedEvents} onSelect={(e) =>{ // where you call setSelectedEvent(e)
                console.log('opening details for event:', e)
                setSelectedEvent(e)
              }} />
            )}
          </>
        )}
      </main>

      <footer className="footer">
        <small>Built as a coding challenge. Data may be from remote or bundled fallback.</small>
      </footer>

      <EventDetails event={selectedEvent} onClose={() => setSelectedEvent(null)} />
    </div>
  )
}
