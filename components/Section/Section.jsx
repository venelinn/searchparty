import PropTypes from "prop-types";
import { useRef, useEffect } from "react";
import { useRouter } from "next/router";
import cx from "classnames";
import Image from "next/image";
// import { getOptimizedImageURL } from "../../utils/common";
import gsap from "gsap";
import useReduceMotion from "../../hooks/useReduceMotion";
import useIsomorphicLayoutEffect from "../../hooks/useIsomorphicLayoutEffect";
import { Heading } from "../Headings";
import styles from  "./Section.module.scss";


const animateSectionTitle = (element, animationID) => {
  if (animationID) {
    gsap.from(`[data-anim=${animationID}] [data-anim='section-title']`, {
      opacity: 0,
      duration: animationID === "home-hero" ? 1.5 : 1,
      y: 40,
      scale: animationID === "home-hero" ? 1.1 : 1,
      delay: animationID === "home-hero" ? 1.5 : 0,
      ease: "power4.out",
      scrollTrigger: {
        trigger: element,
        start: "top 60%",
      },
    });
  }
};

export const Section = ({
	id = "",
  children = null,
  className = "",
  classNames = {},
  color = null,
  image = undefined,
	size = "fixed",
	anchor = undefined,
	animationID = null,
	isHidden = false,
	heading = {},
	subHeading = "",
	isolation = false,
	fullHeight = false,
	nested = false,
	height = undefined,
	contentAlign = undefined,
  ...props
}) => {
	const reduceMotion = useReduceMotion();
	const router = useRouter();
	const element = useRef();
  const classes = cx(styles.section, classNames?.main, {
		[styles["section--full"]]: size === "full",
		[styles["section--full-height"]]: fullHeight,
		[styles["section--vhidden"]]: isHidden,
		[styles["section--isolate"]]: isolation,
		[styles["section--nested"]]: nested,
		[styles[`section--${contentAlign}`]]: contentAlign,
    [className]: className,
		"rel": image || isolation,
  });

	// useIsomorphicLayoutEffect(() => {
  //   animateSectionTitle(element.current, animationID, reduceMotion);
  // }, [animationID, reduceMotion]);

  // useEffect(() => {
  //   const handleRouteChange = () => {
  //     animateSectionTitle(element.current, animationID, reduceMotion);
  //   };

  //   router.events.on("routeChangeComplete", handleRouteChange);

  //   return () => {
  //     router.events.off("routeChangeComplete", handleRouteChange);
  //   };
  // }, [router, animationID, reduceMotion]);

	return (
		<section
			className={classes}
			data-size={size}
			data-color={color}
			data-anim={animationID}
			id={anchor}
			ref={element}
			style={color ? { "--bgr-section-color": `var(--color-${color})` } : null}
			{...props}
		>

			{image && (
				<div className={cx(styles.section__image, classNames?.image)} data-anim="section-img-wrap">
					<Image
						src={image.src} //
						alt={image.alt}
						fill
						data-anim="section-img"
						className={cx(styles.section__image__img, classNames?.imageImg)}
					/>
				</div>
			)}
			<div
				className={cx(styles.section__inner, classNames?.inner)}
				>
			{subHeading && (
				<span
					data-sb-field-path="subheading"
					className={cx(styles.section__subHeading, classNames?.subHeading)}
				>{subHeading}</span>
			)}
			{heading?.heading && (
				<Heading
					as={heading?.as}
					size={heading?.size}
					uppercase={heading?.uppercase}
					animationID="section-title"
					center={heading?.center}
					className={cx(styles.section__heading, classNames?.heading)}
					>
					{heading?.heading}
				</Heading>
			)}
				{children}
			</div>
		</section>
  );
};

Section.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  size: PropTypes.oneOf(["fixed", "full"]),
  height: PropTypes.oneOf(["full", "half", "quarter"]),
  color: PropTypes.string,
  anchor: PropTypes.string,
  image: PropTypes.object,
	classNames: PropTypes.shape({
		main: PropTypes.string,
		inner: PropTypes.string,
		image: PropTypes.string,
		imageImg: PropTypes.string,
		heading: PropTypes.string,
	}),
	animationID: PropTypes.string,
	anchor: PropTypes.string,
	isHidden: PropTypes.bool,
	title: PropTypes.string,
	subtitle: PropTypes.string,
};

// export default Section;
// export { Section };
