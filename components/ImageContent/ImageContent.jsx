import Markdown from "markdown-to-jsx";
import Image from "next/image";
import Section from "../Section";
import { Button } from "../Button/Button.jsx";
import styles from "./ImageContent.module.scss";

const ContentSection = ({ content, link } ) => (
	<div data-anim="content-image" className={styles.module__content}>
		<Markdown options={{ forceBlock: true }} data-sb-field-path="body">
			{content}
		</Markdown>
		{link && link?.src && <Button />}
	</div>
);

const ImageSection = ({ image }) => (
	<div
		className={styles.module__image}
		data-anim="cover-image"
		>
			{/* <ContentfulImage image={image} /> */}
			<Image
				src={image.src}
				alt={image.alt}
				width={image.width}
				height={image.height}
				/>
  </div>
);

export const ImageContent = ({
	id,
	heading,
	subHeading,
	animationID,
	theme,
	image,
	content,
	fullHeight,
	isolation,
	isContentFirst
}) => {
	const order = isContentFirst ? "content-first" : "image-first";
  return (
		<Section
			animationID={animationID}
			subHeading={subHeading}
			heading={heading}
			fullHeight={fullHeight}
			isolation={isolation}
			theme={theme}
    >
			<div
				className={styles.module}
				data-order={order}
				data-sb-object-id={id}
				>
			{isContentFirst ? (
					<>
						<ContentSection content={content} />
						{image && <ImageSection image={image} />}
					</>
				) : (
					<>
						{image && <ImageSection image={image} />}
						<ContentSection content={content} />
					</>
				)}
			</div>
		</Section>
  );
};
