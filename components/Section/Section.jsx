import PropTypes from "prop-types";
import {
	useRef,
	// useEffect
} from "react";
// import { useRouter } from "next/router";
import cx from "classnames";
import Image from "next/image";
import gsap from "gsap";
// import useReduceMotion from "../../hooks/useReduceMotion";
// import useIsomorphicLayoutEffect from "../../hooks/useIsomorphicLayoutEffect";
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
  image = undefined,
	animationID = null,
	heading = {},
	subHeading = "",
	fullHeight = false,
	size = "fixed",
	height = undefined,
	contentAlign = undefined,
  ...props
}) => {
	// const reduceMotion = useReduceMotion();
	// const router = useRouter();
	const element = useRef();
  const classes = cx(styles.section, classNames?.main, {
		[styles["section--full"]]: size === "full",
		[styles["section--full-height"]]: fullHeight,
		[styles[`section--${contentAlign}`]]: contentAlign,
    [className]: className,
		"rel": image,
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
			data-anim={animationID}
			ref={element}
			{...props}
		>

			{image && (
				<div className={cx(styles.section__image, classNames?.image)} data-anim="section-img-wrap">
					<Image
						src={image.src}
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
				<span className={cx(styles.section__subHeading, classNames?.subHeading)}>{subHeading}</span>
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
	title: PropTypes.string,
	subtitle: PropTypes.string,
  className: PropTypes.string,
	classNames: PropTypes.shape({
		main: PropTypes.string,
		inner: PropTypes.string,
		image: PropTypes.string,
		imageImg: PropTypes.string,
		heading: PropTypes.string,
	}),
  size: PropTypes.oneOf(["fixed", "full"]),
  height: PropTypes.oneOf(["full", "half", "quarter"]),
  image: PropTypes.object,
	animationID: PropTypes.string,
};

// export default Section;
// export { Section };
