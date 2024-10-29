import Markdown from "markdown-to-jsx";
import Image from "next/image";
import Section from "../Section/index.jsx";
import { Button } from "../Button/Button.jsx";
import styles from "./Events.module.scss";
import FormattedDate from "../../utils/DateFormat";

export const Events = ({ id, events, title, locale }) => {
  // const order = isContentFirst ? "content-first" : "image-first";

  return (
    <div>
      {events.map((event) => (
        <div className="event-row" key={event.id}>
          <div className="event-cell cell-date">
            <span className="bth-day">
							<FormattedDate dateStr={event.date} locale={locale} /></span>
          </div>
          <div className="event-cell cell-venue">
            <div>
              <div className="bth-venue">{event.venue}</div>
              <div className="bth-location">{event.location}</div>
            </div>
          </div>
          <div className="event-cell cell-ticket top-tickets">
            <div className="horizontal-row-button-container">
              <a className="btn event-button bth-btn">Notify Me</a>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
