import PropTypes from "prop-types";
import { Band } from "./Band";

const BandConnector = (props) => {
	return (
		<Band
			heading={props?.heading}
			items={props?.members}
			id={props?.id}
		/>
	);
};

// TODO: props

export default BandConnector;
export { BandConnector };
