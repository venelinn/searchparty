import { useEffect, useMemo } from "react";
import gsap from "gsap";

import { Section } from "../Section";
import { Heading } from "../Headings";
import { Event } from "./Event";
import { Row, Cell } from "../Grid";
import useReduceMotion from "../../hooks/useReduceMotion";
import styles from "./Events.module.scss";

const renderEvents = (events, type, locale) => {
  if (!events || events.length === 0) {
    return <p>No events available</p>;
  }

  return events.map((event) => (
    <Cell key={event.id}>
			<Event type={type} event={event} locale={locale} />
		</Cell>
  ));
};
export const Events = ({ id, events, heading, locale, onlyUpcoming }) => {
  const reduceMotion = useReduceMotion();

   // Memoize the event categorization to avoid unnecessary recalculations
	 const { upcomingEvents, pastEvents } = useMemo(() => {
    const currentDate = new Date();
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
    return { upcomingEvents: upcoming, pastEvents: past };
  }, [events]);


	const eventsAnimation = () => {
		gsap.from(`[data-anim='events']`, {
      duration: 1.5,
      opacity: 0,
      delay: 1.5,
      // scale: 1.1,
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
				<Heading as="h3" size="h3" uppercase={true} className={styles.event__heading}>
					Upcoming Events
				</Heading>
				<Row cols={2}>
					{renderEvents(upcomingEvents, "upcoming", locale)}
				</Row>

				<Heading as="h3" size="h3" uppercase={true} className={styles.event__heading}>
					Past Events
				</Heading>
				<Row cols={1}>
				{renderEvents(pastEvents, "past", locale)}
				</Row>
			</div>
    </Section>
  );
};
