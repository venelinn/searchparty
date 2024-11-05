import { useEffect } from "react";
import PropTypes from "prop-types";
import Image from "next/image";
import cx from "classnames";
import gsap from "gsap";
import useReduceMotion from "../../hooks/useReduceMotion";
import { Section } from "../Section";
import styles from "./Hero.module.scss";

const Hero = ({
	id,
	images,
	locale,
	content,
	imagePriority,
	animationID = "undefined",
	size
}) => {
	const reduceMotion = useReduceMotion();
	const image = images?.[0].image[0];
	// console.log("content", content);

	const heroAnimation = () => {
		gsap.from(`[data-anim="${animationID}"] [data-anim='section-img-wrap']`, {
      duration: 1.5,
      opacity: 0,
      delay: .5,
      scale: 1.1,
			ease: "power4.out",
    });


    gsap.from("header", { opacity: 0, duration: 1, delay: 1.5 });

		gsap.from(`[data-anim=${animationID}] [data-anim='hero-content']`, {
      opacity: 0,
      duration: 1,
      delay: 1.5,
      ease: "power4.out",
    });
  };

	useEffect(() => {
		let ctx = gsap.context(() => {
			if (!reduceMotion && animationID) {
				heroAnimation()
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
export { Hero };

Hero.propTypes = {
	id: PropTypes.string,
  images: PropTypes.array,
  animationID: PropTypes.string,
	size: PropTypes.oneOf(["fixed", "full", "half", "quarter"]),
	locale: PropTypes.string,
	content: PropTypes.array,
};
