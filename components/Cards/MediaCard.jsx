	import Link from "next/link";
	import Image from "next/image";
	import FormattedDate from "../../utils/DateFormat";
	import styles from "./MediaCard.module.scss";

	const MediaCard = ({ item }) => {
		const { title, slug, date, locale, cover } = item;

		return (
			<div className={styles.card}>
				<div className={styles.card__content}>
					<h2 className={styles.card__title}>{title}</h2>
					<FormattedDate dateStr={date} locale={locale} />
				</div>
				<Image
					src={cover[0].src}
					alt={cover[0].alt}
					width={cover[0].width}
					height={cover[0].height}
				/>
				<Link href={`/media/${slug}`}><span className="sr-only">View more</span></Link>
			</div>
		);
	};

	export default MediaCard;
	export { MediaCard };