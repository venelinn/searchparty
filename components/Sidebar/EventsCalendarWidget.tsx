import { EventsCalendarConnector } from '@/components/Calendar';
import enMessages from '@/messages/en.json';
import { SidebarWidget } from './SidebarWidget';

interface EventsCalendarWidgetProps {
  locale: string;
}

export async function EventsCalendarWidget({
  locale,
}: EventsCalendarWidgetProps) {
  const messages = enMessages;
  const title = messages.Events.eventsCalendar;

  return (
    <SidebarWidget title={title}>
      <EventsCalendarConnector locale={locale} heading={{ heading: title }} />
    </SidebarWidget>
  );
}
