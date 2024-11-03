	import Link from "next/link";
	import Image from "next/image";
	import FormattedDate from "../../utils/DateFormat";
	import styles from "./Media.module.scss";

	const MediaCard = ({ item }) => {
		const { title, slug, date, locale, cover } = item;

		return (
			<div key={item.id}>
				<h2>{title}</h2>
				<FormattedDate dateStr={date} locale={locale} />
				<Image
					src={cover[0].src}
					alt={cover[0].alt}
					width={cover[0].width}
					height={cover[0].height}
				/>
				<Link href={`/media/${slug}`}>View more</Link>
			</div>
		);
	};

	export default MediaCard;
	export { MediaCard };