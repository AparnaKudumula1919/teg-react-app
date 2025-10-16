// src/api.ts (minimal version - keep your fetchWithTimeout etc.)
import type { ApiShape, Venue, EventItem } from './types'

const REMOTE_URL = 'https://teg-coding-challenge.s3.ap-southeast-2.amazonaws.com/events/event-data.json'
const FALLBACK_URL = '/event-data-fallback.json'
const FETCH_TIMEOUT = 8000

async function fetchWithTimeout(url: string, timeout = FETCH_TIMEOUT) {
  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), timeout)
  try {
    const res = await fetch(url, { signal: controller.signal })
    clearTimeout(id)
    return res
  } catch (err) {
    clearTimeout(id)
    throw err
  }
}

function safeArray<T>(val: unknown): T[] {
  return Array.isArray(val) ? (val as T[]) : []
}

function pickFirst<T>(obj: any, keys: string[]): T | undefined {
  if (!obj) return undefined
  for (const k of keys) {
    if (Object.prototype.hasOwnProperty.call(obj, k) && obj[k] != null) {
      return obj[k] as T
    }
  }
  return undefined
}

// src/api.ts (mapEventsToVenues)
// src/api.ts -> replace your current mapEventsToVenues with this function

function mapEventsToVenues(api: ApiShape): { venues: Venue[] } {
  const venues = safeArray<Venue>(api.venues).map(v => ({
    ...v,
    id: v.id !== undefined && v.id !== null ? String(v.id) : String(Math.random()),
    events: []
  }))

  const events = safeArray<EventItem>(api.events)
  const venueIndex = new Map<string, Venue>()
  venues.forEach(v => venueIndex.set(String(v.id), v))

  const unmapped: EventItem[] = []

  events.forEach(rawEvt => {
    const vidRaw = rawEvt.venueId ?? (rawEvt as any).venue_id ?? (rawEvt as any).venue
    const vid = vidRaw !== undefined && vidRaw !== null ? String(vidRaw) : null

    // canonicalize date
    const canonicalDate = (rawEvt as any).startDate ?? (rawEvt as any).date ?? undefined

    // Build base normalized event object (copy location if present on event)
    const evt: EventItem = {
      ...rawEvt,
      date: canonicalDate,
      location: rawEvt.location ?? undefined,
      venue_id: vid ?? undefined,
      venueId: vid ?? undefined,
      venue_name: undefined
    }

    if (vid && venueIndex.has(vid)) {
      const venue = venueIndex.get(vid)!
      // If event.location is missing, copy venue.location (or venue.name) into event.location
      if (!evt.location) {
        evt.location = (venue as any).location ?? (venue as any).address ?? venue.name ?? undefined
      }
      evt.venue_name = venue.name ?? venue.id
      venue.events = venue.events ?? []
      venue.events.push(evt)
    } else {
      // unmapped event — keep as-is (no venue to copy from)
      unmapped.push(evt)
    }
  })

  if (unmapped.length > 0) {
    venues.push({ id: 'unmapped', name: 'Unmapped / Unknown Venue', events: unmapped })
  }

  return { venues }
}


export async function getEventData(): Promise<{ data: { venues: Venue[] }, source: 'remote'|'fallback' }> {
  try {
    const res = await fetchWithTimeout(REMOTE_URL, FETCH_TIMEOUT)
    if (!res.ok) throw new Error(`Remote fetch failed: ${res.status}`)
    const json = await res.json()
    const mapped = mapEventsToVenues(json as ApiShape)
    if (mapped.venues && mapped.venues.length > 0) return { data: mapped, source: 'remote' }
    const fb = await fetch(FALLBACK_URL); const fj = await fb.json()
    return { data: mapEventsToVenues(fj as ApiShape), source: 'fallback' }
  } catch (e) {
    console.error('Fetch error, loading fallback', e)
    try { const fb = await fetch(FALLBACK_URL); const fj = await fb.json(); return { data: mapEventsToVenues(fj as ApiShape), source: 'fallback' } }
    catch (err) { console.error('Fallback failed', err); return { data: { venues: [] }, source: 'fallback' } }
  }
}
