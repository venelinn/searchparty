import fs from "node:fs";
import path from "node:path";
import { getEventPermalink } from "@/utils/common";
import { getAllEvents } from "@/utils/content";
import type { HeadingProps } from "../Headings";
import { type CalendarEvent, EventCalendar } from "./EventCalendar";

interface EventsCalendarConnectorProps {
  locale: string;
  selectedDate?: string;
  onDateSelect?: (date: string) => void;
  heading?: HeadingProps;
}

function hasEventDetailPages(): boolean {
  const slugRoute = path.join(process.cwd(), "app", "events", "[slug]");
  return fs.existsSync(slugRoute);
}

export async function EventsCalendarConnector({
  locale,
  heading,
  selectedDate,
  onDateSelect,
}: EventsCalendarConnectorProps) {
  const events = (await getAllEvents(locale)) as any[];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const linkEvents = hasEventDetailPages();

  const calendarEvents: CalendarEvent[] = events.map((event) => {
    const eventName = event.venue || event.heading?.heading || "Event";
    const permalink = linkEvents
      ? getEventPermalink({ locale, title: eventName })
      : "";
    const eventDate = new Date(event.date);
    eventDate.setHours(0, 0, 0, 0);

    const normalizedDate = event.date.includes("T") ? event.date.split("T")[0] : event.date;

    return {
      date: normalizedDate,
      datetime: event.date,
      title: eventName,
      permalink,
      isPastEvent: eventDate < today,
    };
  });

  return (
    <EventCalendar
      calendarEvents={calendarEvents}
      locale={locale}
      heading={heading}
      selectedDate={selectedDate}
      onDateSelect={onDateSelect}
      linkEvents={linkEvents}
    />
  );
}
