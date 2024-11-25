import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import gsap from "gsap";
import useReduceMotion from "../../hooks/useReduceMotion";
import { Section } from "../Section";
import styles from "./Hero.module.scss";
import { Link } from "lucide-react";
import Icon from "../Icons/Icons";

const heroAnimation = (animationID) => {
	const timeline = gsap.timeline();
	const sectionSelector = `[data-anim="${animationID}"] [data-anim="section-img-wrap"]`;
  const heroContentSelector = `[data-anim="${animationID}"] [data-anim="hero-content"]`;
  const heroAnchor = `[data-anim="${animationID}"] [data-anim="hero-anchor"]`;

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
  }, "-=0.5")
	.from(heroAnchor, {
		opacity: 0,
		duration: 1,
		ease: "power4.out",
	}, "-=0.5");
};

const Hero = ({
	images,
	content,
	animationID = "undefined",
	height,
	imageAlignment,
	anchorToNext,
}) => {
	const reduceMotion = useReduceMotion();
	const image = images?.[0].image[0];
	const [nextSectionId, setNextSectionId] = useState(null);
  const heroRef = useRef(null);


	useEffect(() => {
		let ctx = gsap.context(() => {
			if (!reduceMotion && animationID) {
				heroAnimation(animationID);
			}
		});
		return () => ctx.revert(); // <- cleanup!
	}, [reduceMotion]);

	useEffect(() => {
    if (anchorToNext && height === "full" && heroRef.current) {
      const nextSection = heroRef.current.nextElementSibling; // Get the next sibling in the DOM
      if (nextSection?.id) {
        setNextSectionId(`#${nextSection.id}`); // Set the ID of the next section
      }
    }
  }, [anchorToNext, height]);

  return (
    <Section
      image={image}
      animationID={animationID}
			height={height}
			ref={heroRef}
			imageAlignment={imageAlignment}
      classNames={{
        main: styles.main,
        inner: styles.inner,
        heading: styles.heading,
      }}
    >
			<div className={styles.hero__content} data-anim="hero-content">
				{content}
			</div>
			{(anchorToNext && height === "full" && nextSectionId) && (
        <a href={nextSectionId} className={styles.hero__down} data-anim="hero-anchor" title="Scroll to next section">
          <Icon name="ChevronsDown" size="3em" color="#ffffff" />
        </a>
      )}
    </Section>
  );
};

export default Hero;
export { Hero, heroAnimation };

Hero.propTypes = {
	id: PropTypes.string,
  images: PropTypes.array,
  animationID: PropTypes.string,
	size: PropTypes.oneOf(["full", "half", "quarter"]),
	locale: PropTypes.string,
	content: PropTypes.array,
};
