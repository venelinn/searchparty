# Event Calendar

**Created**: 2026-06-05
**Updated**: 2026-06-05

## Overview

The sidebar calendar (`components/Calendar/EventCalendar.tsx`) renders a month grid that highlights days with events. Clicking an event day shows the **event name, month/day, and time** in a panel below the grid. When event detail pages exist, event days become links instead (see *Link vs. select mode*).

## File Structure

```
components/Calendar/
├── EventCalendar.tsx              ← presentational calendar (client component)
├── EventCalendar.module.scss      ← styles, incl. .selectedEvent panel
├── EventsCalendarConnector.tsx    ← server component, maps Contentful events → CalendarEvent[]
└── index.ts
```

## Data Flow

```
EventsCalendarConnector (server)
    │
    ├── getAllEvents(locale)        ← all events from Contentful
    ├── hasEventDetailPages()       ← true if app/events/[slug] exists → linkEvents
    │
    └── maps each event → CalendarEvent and renders <EventCalendar />
```

### CalendarEvent shape

```typescript
interface CalendarEvent {
  date: string;        // normalized "YYYY-MM-DD" — used as the grid lookup key
  datetime?: string;   // full original ISO datetime (incl. time) — used for display
  title: string;       // event name
  permalink: string;   // detail-page URL (only when linkEvents)
  isPastEvent: boolean;
}
```

### Field mapping (connector)

| CalendarEvent field | Source | Notes |
|---------------------|--------|-------|
| `title` | `event.venue` | The event name. Events have **no** `heading` field — the old `event.heading?.heading` always fell back to `"event"`. |
| `date` | `event.date` split on `"T"` | Date-only key so the grid can match the day. |
| `datetime` | `event.date` | Keeps the time, used by the bottom panel. |
| `isPastEvent` | `event.date < today` | |

## Click-to-Select Behaviour

- Event days render as `<button>`s. Clicking one sets `selectedEvent` state and calls the optional `onDateSelect` callback.
- The panel below the grid (`.selectedEvent`) shows:
  - **Title** — `selectedEvent.title` (uppercase).
  - **Date / time** — month + day via `date-fns` (localized), and the time via the shared `FormattedTime` component (`utils/DateFormat.js`) so it matches the events list: 12-hour `hh:mm a`, timezone-aware.

## Link vs. Select Mode

`hasEventDetailPages()` checks for `app/events/[slug]`:

| Mode | Condition | Event day renders as | Behaviour |
|------|-----------|----------------------|-----------|
| Link | detail pages exist | `<Link>` | Navigates to the event permalink |
| Select | no detail pages | `<button>` | Shows the name/date panel below the grid |

## Gotchas

- The grid key (`date`) must stay date-only (`YYYY-MM-DD`); display uses `datetime`. Don't reuse the stripped key for the time — that's what produced the `00:00` bug.
- Time formatting goes through `FormattedTime`; changing its timezone (currently `America/Toronto` in `utils/DateFormat.js`) affects both the events list and this panel.
