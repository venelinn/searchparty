"use client";

import { useMemo } from "react";
import { Section } from "../Section";
import { Heading } from "../Headings";
import { Event } from "./Event";
import { Icon } from "../Icons/Icons";
import styles from "./Events.module.scss";

export interface EventsProps {
  id?: string;
  events: any[];
  columns?: number;
  layout?: string;
  heading?: any;
  locale?: string;
  onlyUpcoming?: boolean;
}

const renderEvents = (events: any[], type: 'upcoming' | 'past', locale: string) => {
  if (!events || events.length === 0) {
    return <p>No events available</p>;
  }

  return events.map((event) => (
    <Event key={event.id} type={type} event={event} locale={locale} />
  ));
};
export const Events = ({ id, events, columns, layout, heading, locale, onlyUpcoming }: EventsProps) => {

   // Memoize the event categorization to avoid unnecessary recalculations
	 const { upcomingEvents, pastEvents } = useMemo(() => {
		const currentDate = new Date();

		// Separate events into upcoming and past
		const upcoming: typeof events = [];
		const past: typeof events = [];

		events.forEach((event) => {
			const eventDate = new Date(event.date);
			if (eventDate > currentDate) {
				upcoming.push(event);
			} else {
				past.push(event);
			}
		});

		// Sort upcoming events by ascending date
		upcoming.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

		// Sort past events by descending date
		past.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

		return { upcomingEvents: upcoming, pastEvents: past };
	}, [events]);


  return (
    <Section id={id} heading={heading} animationID="events">
			<div className={styles.events}>
				<div data-type="upcoming">
				<Heading as="h2" size="h2" uppercase={true} className={styles.events__heading}>
					<Icon name="Guitar" color="var(--color-grey-mid)"/> Upcoming Events
				</Heading>
				{renderEvents(upcomingEvents, "upcoming", locale ?? "en")}
				</div>

				<div data-type="past">
					<Heading as="h2" size="h2" uppercase={true} className={styles.events__heading}>
						Past Events
					</Heading>
					{renderEvents(pastEvents, "past", locale ?? "en")}
				</div>
			</div>
    </Section>
  );
};
