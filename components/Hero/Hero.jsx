import { useEffect } from "react";
import PropTypes from "prop-types";
import gsap from "gsap";
import useReduceMotion from "../../hooks/useReduceMotion";
import { Section } from "../Section";
import styles from "./Hero.module.scss";

const heroAnimation = (animationID, onComplete) => {
	const timeline = gsap.timeline({ onComplete });
	const sectionSelector = `[data-anim="${animationID}"] [data-anim="section-img-wrap"]`;
  const heroContentSelector = `[data-anim="${animationID}"] [data-anim="hero-content"]`;

  timeline.from(sectionSelector, {
    duration: 1.5,
    opacity: 0,
    delay: 0.5,
    scale: 1.1,
    ease: "power4.out",
  })
  .from("header", { opacity: 0, duration: 1, delay: 1 }, "-=1")
  .from(heroContentSelector, {
    opacity: 0,
    duration: 1,
    ease: "power4.out",
  }, "-=0.5");
};

const Hero = ({
	id,
	images,
	content,
	imagePriority,
	animationID = "undefined",
	size,
}) => {
	const reduceMotion = useReduceMotion();
	const image = images?.[0].image[0];


	useEffect(() => {
		let ctx = gsap.context(() => {
			if (!reduceMotion && animationID) {
				heroAnimation(animationID);
			}
		});
		return () => ctx.revert(); // <- cleanup!
	}, [reduceMotion]);

  return (
    <Section
      image={image}
			imagePriority={imagePriority}
      animationID={animationID}
			size={size}
      classNames={{
        main: styles.main,
        inner: styles.inner,
        heading: styles.heading,
				imageImg: styles.imageTop
      }}
    >

			<div className={styles.hero__content} data-anim="hero-content">
				{content}
			</div>
    </Section>
  );
};

export default Hero;
export { Hero, heroAnimation };

Hero.propTypes = {
	id: PropTypes.string,
  images: PropTypes.array,
  animationID: PropTypes.string,
	size: PropTypes.oneOf(["fixed", "full", "half", "quarter"]),
	locale: PropTypes.string,
	content: PropTypes.array,
};
