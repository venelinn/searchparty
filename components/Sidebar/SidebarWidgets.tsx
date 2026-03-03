import { EventsCalendarConnector } from '@/components/Calendar';
import SubscribeForm from '@/components/Subscribe/Subscribe';
import type { WidgetType } from '@/types/widgets';
import { SidebarWidget } from './SidebarWidget';

interface SidebarWidgetsProps {
  widgets: WidgetType[];
  locale: string;
}

export function SidebarWidgets({ widgets, locale }: SidebarWidgetsProps) {
  if (!widgets.length) return null;

  return (
    <>
      {widgets.map((widget) => {
        switch (widget) {
          case 'calendar':
            return (
              <SidebarWidget key={widget}>
                <EventsCalendarConnector locale={locale} />
              </SidebarWidget>
            );
          case 'subscribe':
            return (
              <SidebarWidget key={widget}>
                <SubscribeForm />
              </SidebarWidget>
            );
          default:
            return null;
        }
      })}
    </>
  );
}
