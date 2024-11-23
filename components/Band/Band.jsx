import { useEffect, useRef } from "react";
import gsap from "gsap";
import PropTypes from "prop-types";
import { Section } from "../Section";
import { Member } from "./Variants/Member";
import styles from "./Band.module.scss";

const Band = ({ heading = {}, items = [] }) => {
  const containerRef = useRef(null);
	useEffect(() => {
    if (containerRef.current) {
      // Select all `Member` components for animation
      const members = Array.from(containerRef.current.querySelectorAll("[data-anim-item]"));

      gsap.fromTo(
        members,
        { opacity: 0, y: 20 }, // Start state
        {
          opacity: 1,
          y: 0, // End state
          stagger: 0.1, // Add stagger effect between items
          delay: 1.5, // Delay before animation starts
          duration: 0.6,
          ease: "power4.out",
        }
      );
    }
  }, []);
	return (
    <Section
			classNames={{
				main: styles.main,
			}}
			heading={heading}
			size="full"
			animationID="gallery-grid"

		>
			<div data-anim="brands" ref={containerRef}>
				{items && items.length > 0 && (
					<div
						className={styles.band}
						data-anim="gallery-grid-items"
						>
						{items.map((item, index) => <Member data-anim-item data={item} key={index} tabIndex={index} /> )}
					</div>
				)}
			</div>
    </Section>
  );
};

Band.propTypes = {
	heading: PropTypes.object,
	subHeading: PropTypes.string,
	items: PropTypes.arrayOf(PropTypes.object),
	theme: PropTypes.shape({
		color: PropTypes.string,
	}),
	link: PropTypes.shape({
		href: PropTypes.string,
		title: PropTypes.string,
		buttonVariant: PropTypes.string,
	}),
	labels: PropTypes.shape({
		learnMore: PropTypes.string,
	}),
};

export default Band;
export { Band }
