import PropTypes from "prop-types";
import { useRef, useEffect, forwardRef } from "react";
import { useRouter } from "next/router";
import cx from "classnames";
import Image from "next/image";
import gsap from "gsap";
import { Heading } from "../Headings";
import styles from  "./Section.module.scss";

// eslint-disable-next-line react/display-name
export const Section = forwardRef(
  (
    {
      id = "",
      children = null,
      className = "",
      classNames = {},
      image = undefined,
      animationID = null,
      heading = {},
      size = "fixed",
      height = undefined,
      imageAlignment = undefined,
      ...props
    },
    ref
  ) => {
	const sectionRef = useRef(null);

	useEffect(() => {
    if (!sectionRef.current || !animationID) return;

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 85%", // Adjust trigger position as needed
        toggleActions: "play none none none",
      },
    });

    timeline
      .from(
        `[data-anim=${animationID}] [data-anim='section-title']`,
        {
          opacity: 0,
          y: 20,
          duration: 0.8,
          ease: "power4.out",
        },
        0 // Start immediately
      )
      .from(
        `[data-anim=${animationID}] [data-anim='section-img']`,
        {
          opacity: 0,
          scale: 1.1,
          duration: 1,
          ease: "power4.out",
        },
        0.3 // Delay slightly after the title starts
      )
      .from(
        `[data-anim=${animationID}] .${styles.section__inner}`,
        {
          opacity: 0,
          y: 20,
          duration: 0.8,
          ease: "power4.out",
        },
        0.6 // Delay after the image starts
      );

    return () => {
      if (timeline.scrollTrigger) {
        timeline.scrollTrigger.kill();
      }
      timeline.kill();
    };
  }, [animationID]);

	const classes = cx(styles.section, classNames?.main, {
		[styles["section--full-width"]]: size === "full",
		[styles[`section--${height}-height`]]: height,
		[className]: className,
		"rel": image,
  });

	return (
		<section
			id={id}
			className={classes}
			data-anim={animationID}
			ref={ref}
			{...props}
		>

			{image && (
				<div className={cx(styles.section__image, classNames?.image)} data-anim="section-img-wrap">
					<Image
						src={image.src}
						alt={image.alt}
						fill
						data-anim="section-img"
						className={cx(styles.section__image__img, classNames?.imageImg, {
							[styles[`hero-${imageAlignment}`]]: imageAlignment,
						})}
					/>
				</div>
			)}
			<div
				className={cx(styles.section__inner, classNames?.inner)}
				>
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
  }
);

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
	imageAlignment: PropTypes.oneOf(["top", "bottom"]),
  image: PropTypes.object,
	animationID: PropTypes.string,
};

// export default Section;
// export { Section };
