import PropTypes from "prop-types";
import Image from "next/image";
import Markdown from "markdown-to-jsx";
import cx from "classnames";
import Section from "../Section";
import Button from "../Button/Button";
import styles from "./Hero.module.scss";

const Hero = (props) => {
	const processedMarkdown = `# ${props.heading}`;
	const image = props?.images?.[0].image[0];
  return (
    <Section
      image={image}
      animationID={props?.animationID}
      theme={props?.theme?.color}
      classNames={{
        main: styles.main,
        inner: styles.inner,
        heading: styles.heading,
      }}
    >
			{props.media && (
				<Image
					src={image.src}
					alt={image.alt}
					width={image.width}
					height={image.height}
					className={styles.item__logo__img}
				/>
			)}
			{(props?.heading || props?.link?.url) && (
				<div className={styles.hero__container}>
					{props?.heading && (
						<Markdown
							className={cx(styles.hero__title, {
								[styles[`hero__title--${props.headingAlignment}`]]: props.headingAlignment,
							})}
							data-anim="hero-heading">
							{processedMarkdown}
						</Markdown>
					)}
					{props?.description && (
						<Markdown
							className={styles.hero__desc}
							data-anim="hero-description">
							{props.description}
						</Markdown>
					)}
					{props?.link && props?.link?.url && (
						<Button
							href={props?.link.url}
							label={props?.link?.label}
							variant={props?.link?.theme}
							animationID="hero-heading"
							wrapperClassName={styles.grid__button__wrapper}
						/>
					)}
				</div>

			)}

    </Section>
  );
};

export default Hero;
export { Hero };

Hero.propTypes = {
  images: PropTypes.array.isRequired,
  title: PropTypes.string,
  animationID: PropTypes.string,
};

Hero.defaultProps = {
  animationID: "undefined",
  title: undefined,
};
