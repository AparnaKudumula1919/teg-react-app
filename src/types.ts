// src/types.ts
export interface EventItem {
  id: string
  name?: string
  startDate?: string
  date?: string
  location?: string
  description?: string
  venueId?: string
  venue_id?: string
  venue_name?: string
}

export interface Venue {
  id: string
  name?: string
  events?: EventItem[]
}

export interface ApiShape {
  venues?: Venue[]
  events?: EventItem[]
}
