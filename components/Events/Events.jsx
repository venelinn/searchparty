import { useEffect, useMemo } from "react";
import gsap from "gsap";
import { Section } from "../Section";
import { Heading } from "../Headings";
import { Event } from "./Event";
import { Icon } from "../Icons/Icons";
import useReduceMotion from "../../hooks/useReduceMotion";
import styles from "./Events.module.scss";

const renderEvents = (events, type, locale) => {
  if (!events || events.length === 0) {
    return <p>No events available</p>;
  }

  return events.map((event) => (
    <Event key={event.id} type={type} event={event} locale={locale} />
  ));
};
export const Events = ({ id, events, columns, layout, heading, locale, onlyUpcoming }) => {
  const reduceMotion = useReduceMotion();

   // Memoize the event categorization to avoid unnecessary recalculations
	 const { upcomingEvents, pastEvents } = useMemo(() => {
		const currentDate = new Date();

		// Separate events into upcoming and past
		const upcoming = [];
		const past = [];

		events.forEach((event) => {
			const eventDate = new Date(event.date);
			if (eventDate > currentDate) {
				upcoming.push(event);
			} else {
				past.push(event);
			}
		});

		// Sort upcoming events by ascending date
		upcoming.sort((a, b) => new Date(a.date) - new Date(b.date));

		// Sort past events by descending date
		past.sort((a, b) => new Date(b.date) - new Date(a.date));

		return { upcomingEvents: upcoming, pastEvents: past };
	}, [events]);



	const eventsAnimation = () => {
		gsap.from(`[data-anim='events']`, {
      duration: 1.5,
      opacity: 0,
      delay: 1.5,
			ease: "power4.out",
    });
  };

	useEffect(() => {
		let ctx = gsap.context(() => {
			if (!reduceMotion) {
				eventsAnimation();
			}
		});
		return () => ctx.revert(); // <- cleanup!
	}, [reduceMotion]);

  return (
    <Section id={id} heading={heading} animationID="events">
			<div className={styles.events}>
				<div data-type="upcoming">
				<Heading as="h2" size="h2" uppercase={true} className={styles.events__heading}>
					<Icon name="Guitar" color="var(--color-grey-mid)"/> Upcoming Events
				</Heading>
				{renderEvents(upcomingEvents, "upcoming", locale)}
				</div>

				<div data-type="past">
					<Heading as="h2" size="h2" uppercase={true} className={styles.events__heading}>
						Past Events
					</Heading>
					{renderEvents(pastEvents, "past", locale)}
				</div>
			</div>
    </Section>
  );
};
