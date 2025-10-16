import React from 'react'
import { render, screen } from '@testing-library/react'
import EventDetails from '../components/EventDetails'
import type { EventItem } from '../types'

const evt: EventItem = {
  id: 'e1',
  name: 'Event 1',
  date: '2025-10-21T00:30:00Z',
  location: 'Loc A',
  description: 'Hello'
}

describe('EventDetails', () => {
  test('renders event details and formats date & location', () => {
    const onClose = vi.fn()
    render(<EventDetails event={evt} onClose={onClose} />)

    expect(screen.getByText('Event 1')).toBeInTheDocument()
    expect(screen.getByText('Loc A')).toBeInTheDocument()
    expect(screen.getByText(/2025/)).toBeInTheDocument()
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })
})
