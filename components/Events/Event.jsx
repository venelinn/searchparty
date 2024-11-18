import Image from "next/image";
import { Clock } from "lucide-react";
import {FormattedDate, FormattedTime} from "../../utils/DateFormat";
import { getOptimizedImage } from "../../utils/common";
import { Heading } from "../Headings";
import { Button } from "../Button/Button.jsx";
import styles from "./Event.module.scss";

function generateGoogleMapsURL(lat, lng, placeName) {
	const encodedPlaceName = encodeURIComponent(placeName);
 	return `https://www.google.com/maps?q=${lat},${lng}`;
}

const fallbackImage = "https://res.cloudinary.com/dvgvftw9u/image/upload/q_auto/v1730046867/fallback_m5m9wa"

const Event = ({ event, type, locale }) => {
	// const { url, width, height } = getOptimizedImage(event?.cover[0], 800, 100);
	const cover = event.cover && event.cover[0]
    ? event.cover[0]
    : { src: fallbackImage, alt: "Fallback Cover", width: 507, height: 86 };


  return (
    <div className={styles.event} key={event.id}>
			<div className={styles.event__date}>
				<FormattedDate dateStr={event.date} locale={locale} includeYear={type === "upcoming" ? false : true} />
			</div>
			<figure className={styles.event__image}>
				<Image
					src={cover.src}
					alt={cover.alt}
					width={cover.width}
					height={cover.height}
        />
			</figure>
      <div className={styles.event__content}>
				<div className={styles.event__venue}>{event.venue}</div>
				<div className={styles.event__hour}>
					<Clock /> <FormattedTime dateStr={event.date} locale={locale} />
				</div>
				<p className="ui-caption">Doors opening at 6:30 pm</p>
				{event.venueLogo && event.venueLogo[0] && (
					<figure className={styles.event__logo}>
						<Image
							src={event.venueLogo[0].src}
							alt={event.venueLogo[0].alt}
							width={event.venueLogo[0].width}
							height={event.venueLogo[0].height}
						/>
					</figure>
				)}
			</div>
			<div className={styles.event__cta}>
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
  );
};

export default Event;
export { Event };