import Image from "next/image";
import {FormattedDate, FormattedTime} from "../../utils/DateFormat";
import { getOptimizedImage } from "../../utils/common";
import { Button } from "../Button/Button.jsx";
import styles from "./Event.module.scss";

function generateGoogleMapsURL(lat, lng, placeName) {
	const encodedPlaceName = encodeURIComponent(placeName);
 	return `https://www.google.com/maps?q=${lat},${lng}`;
}

const Event = ({ event, type, locale }) => {
	// const { url, width, height } = getOptimizedImage(event?.cover[0], 800, 100);
  return (
    <div className={styles.event} key={event.id}>
			<figure className={styles.event__image}>
      {event.cover && (
					<Image
          src={event.cover[0].src}
          alt={event.cover[0].alt}
          width={event.cover[0].width}
          height={event.cover[0].height}
        />
      )}
			</figure>
      <div className={styles.event__content}>
				<div className={styles.event__date}>
					<FormattedDate dateStr={event.date} locale={locale} />
				</div>
				<div className={styles.event__date}>
					<FormattedTime dateStr={event.date} locale={locale} />
				</div>
				<div className={styles.event__location}>{event.venue}</div>
				<div>
					{type === "upcoming" && (
						<Button
							variant="primary"
							label="Location"
							isExternal={true}
							externalHref={generateGoogleMapsURL(event.address.lat, event.address.lon, event.venue)}
						/>
					)}
					{(type === "past" && event.gallery) && (
						<Button href={event.gallery} variant="primary" label="Gallery" />
					)}
				</div>
			</div>
    </div>
  );
};

export default Event;
export { Event };