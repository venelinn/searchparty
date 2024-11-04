import { useState, useEffect } from "react";
import { Section } from "../Section";
import { Heading } from "../Headings";
import { Button } from "../Button/Button.jsx";
import FormattedDate from "../../utils/DateFormat";
import styles from "./Events.module.scss";

export const Events = ({ id, events, heading, locale }) => {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);

  useEffect(() => {
    const currentDate = new Date();
    const upcoming = events.filter((event) => new Date(event.date) > currentDate);
    const past = events.filter((event) => new Date(event.date) <= currentDate);
    setUpcomingEvents(upcoming);
    setPastEvents(past);
  }, [events]);

  return (
    <Section id={id} heading={heading}>
			<div  className={styles.events}>
      <Heading as="h3" uppercase={true} className={styles.event__heading}>
        Upcoming Events
      </Heading>
      {upcomingEvents.map((event) => (
        <div className={styles.event} key={event.id}>
          <div className="event-cell">
            <FormattedDate dateStr={event.date} locale={locale} includeYear={false} />
          </div>
          <div className="event-cell cell-venue">
            <div className="bth-venue">{event.venue}</div>
          </div>
          <div className="event-cell cell-ticket top-tickets">
            <div className="bth-location">{event.location}</div>
            <Button variant="primary" >Address</Button>
          </div>
        </div>
      ))}
			</div>

			<div  className={styles.events}>
				<Heading as="h3" uppercase={true} className={styles.event__heading}>
					Past Events
				</Heading>

				{pastEvents.map((event) => (
					<div className={styles.event} key={event.id}>
						<div className={styles.event__date}>
							<FormattedDate dateStr={event.date} locale={locale} />
						</div>
						<div className="event-cell cell-venue">
							<div className="bth-venue">{event.venue}</div>
							<div className="bth-location">{event.location}</div>
						</div>
						<div className="event-cell cell-ticket top-tickets">
							<a className="btn event-button bth-btn">View</a>
						</div>
					</div>
				))}
			</div>
    </Section>
  );
};
