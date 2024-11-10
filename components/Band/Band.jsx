import PropTypes from "prop-types";
import { useRef } from "react";
import cx from "classnames";
import { Section } from "../Section";
import Button from "../Button/Button";
// import Epic from "./Variants/Epic";
import { Member } from "./Variants/Member";
import styles from "./Band.module.scss";

const Band = ({
		heading = {},
		items = [],
	}) => {
	const element = useRef();
	return (
    <Section
			classNames={{
				main: styles.main,
			}}
			heading={heading}
			size="full"
			animationID="gallery-grid"

		>
			<div data-anim="brands" ref={element}>
				{items && items.length > 0 && (
					<div
						className={styles.band}
						data-anim="gallery-grid-items"
						>
						{items.map((item, index) => <Member data={item} key={index} tabIndex={index} /> )}
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
