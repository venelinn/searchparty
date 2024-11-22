import Image from "next/image";
import { useState } from "react";
import { Clock } from "lucide-react";
import {FormattedDate, FormattedTime} from "../../utils/DateFormat";
import { getOptimizedImage } from "../../utils/common";
import { Modal } from "../Modal/Modal";
import { Button } from "../Button/Button.jsx";
import styles from "./Event.module.scss";

function generateGoogleMapsURL(lat, lng, placeName) {
	const encodedPlaceName = encodeURIComponent(placeName);
 	return `https://www.google.com/maps?q=${lat},${lng}`;
}

const fallbackImage = "https://res.cloudinary.com/dvgvftw9u/image/upload/q_auto/v1730046867/fallback_m5m9wa"

const Event = ({ event, type, locale }) => {
	const [modalStates, setModalStates] = useState(false);
	const handleOpenModal = () => {
    setModalStates(true);
  };

  const handleCloseModal = () => {
    setModalStates(false);
  };
	// const { url, width, height } = getOptimizedImage(event?.cover[0], 800, 100);
	const cover = event.cover && event.cover[0]
    ? event.cover[0]
    : { src: fallbackImage, alt: "Fallback Cover", width: 507, height: 86 };

	const logo = event?.venueLogo?.logo[0];
	// const { logoUrl, logoWidth, logoHeight } = getOptimizedImage(logo, 500, 70);
	// console.log(logo);

  return (
    <div className={styles.event} key={event.id}>
			<div className={styles.event__date}>
				<FormattedDate dateStr={event.date} locale={locale} includeYear={type === "upcoming" ? false : true} />
			</div>
			<figure className={styles.event__image}>
				<a onClick={() => handleOpenModal(true)}>
				<Image
					src={cover.src}
					alt={cover.alt}
					width={cover.width}
					height={cover.height}
        />
				</a>
			</figure>
      <div className={styles.event__content}>
				<div className={styles.event__venue}>{event.venue}</div>
				<div className={styles.event__hour}>
					<Clock /> <FormattedTime dateStr={event.date} locale={locale} />
				</div>
				{event.doorsOpen && <p className="ui-caption">Doors open at <FormattedTime dateStr={event.doorsOpen} locale={locale} /></p>}
				{logo && (
					<figure className={styles.event__logo}>
						<Image
							src={logo.src}
							alt={logo.alt}
							width={logo.width}
							height={logo.height}
						/>
					</figure>
				)}
			</div>
			{type === "upcoming" && (
				<Button
					variant="primary"
					label="Location"
					isExternal={true}
					icon="MapPin"
					externalHref={generateGoogleMapsURL(event.address.lat, event.address.lon, event.venue)}
				/>
			)}
			{(type === "past" && event.gallery) && (
				<Button href={event.gallery} icon="Images" variant="primary" label="Gallery" />
			)}
			<Modal isOpen={modalStates} onClose={() => handleCloseModal()}>
				<Image
					src={cover.src}
					alt={cover.alt}
					width={cover.width}
					height={cover.height}
					className={styles.modalImage}
        />
			</Modal>
    </div>
  );
};

export default Event;
export { Event };