import { useState, useEffect } from "react";
import cx from "classnames";
import gsap from "gsap";
import { Section } from "../Section";
import { Heading } from "../Headings";
import { Button } from "../Button/Button.jsx";
import FormattedDate from "../../utils/DateFormat";
import useReduceMotion from "../../hooks/useReduceMotion";
import styles from "./Events.module.scss";

function generateGoogleMapsURL(lat, lng, placeName) {
	const encodedPlaceName = encodeURIComponent(placeName);
 	return `https://www.google.com/maps?q=${lat},${lng}`;
}
/******  354c2d53-1c27-456d-82b3-91d41a5b15e2  *******/
export const Events = ({ id, events, heading, locale, onlyUpcoming }) => {
  const reduceMotion = useReduceMotion();
	const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);

  useEffect(() => {
    const currentDate = new Date();
    const upcoming = events.filter((event) => new Date(event.date) > currentDate);
    const past = events.filter((event) => new Date(event.date) <= currentDate);
    setUpcomingEvents(upcoming);
    setPastEvents(past);
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

	// useEffect(() => {
  //   // Run heroAnimation and pass eventsAnimation to run after it completes
  //   heroAnimation(eventsAnimation);
  // }, []);

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
			<div className={cx(styles.event, styles.event__header)}>
				<div className={styles.event__date}>Date</div>
				<div>Venue</div>
				<div> </div>
			</div>
      {upcomingEvents.map((event) => (
        <div className={styles.event} key={event.id}>
          <div className={styles.event__date}>
						<FormattedDate dateStr={event.date} locale={locale} />
					</div>
          <div className={styles.event__location}>{event.venue}</div>
          <div>
            <Button
							variant="primary"
							label="Location"
							isExternal={true}
							externalHref={generateGoogleMapsURL(event.address.lat, event.address.lon, event.venue)} />
          </div>
        </div>
      ))}
			</div>
			<div  className={styles.events}>
				<Heading as="h3" size="h3" uppercase={true} className={styles.event__heading}>
					Past Events
				</Heading>

				{pastEvents.map((event) => (
					<div className={styles.event} key={event.id}>
						<div className={styles.event__date}>
							<FormattedDate dateStr={event.date} locale={locale} />
						</div>
						<div className={styles.event__location}>
							<div className="bth-venue">{event.venue}</div>
							<div className="bth-location">{event.location}</div>
						</div>
						<div>
							{event.gallery &&	<Button href={event.gallery} variant="primary" label="Gallery" /> }
						</div>
					</div>
				))}
			</div>
    </Section>
  );
};
