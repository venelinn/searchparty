	import Link from "next/link";
	import Image from "next/image";
	import { getOptimizedImage } from "../../utils/common";
	import FormattedDate from "../../utils/DateFormat";
	import styles from "./MediaCard.module.scss";

	const MediaCard = ({ item }) => {
		const { title, slug, date, locale, cover } = item;
		const { url, width, height } = getOptimizedImage(cover[0], 800, 100);

		return (
			<div className={styles.card}>
				<div className={styles.card__content}>
					<h2 className={styles.card__title}>{title}</h2>
					<FormattedDate dateStr={date} locale={locale} />
				</div>
				<Image
					src={url}
					alt={cover[0].alt}
					width={width}
					height={height}
				/>
				<Link href={`/media/${slug}`}><span className="sr-only">View more</span></Link>
			</div>
		);
	};

	export default MediaCard;
	export { MediaCard };